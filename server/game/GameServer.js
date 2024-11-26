import {PlayersManager} from "./PlayersManager.js";
import {validateSignature} from "../utils.js";
import {GameSessionsManager} from "./GameSessionsManager.js";
import {GameMath} from "./GameMath.js";
import {GameSteps} from "./GameSteps.js";
import {SessionExpiredError} from "../errors/SessionExpiredError.js";
import {ServerError} from "../errors/ServerError.js";
import {TaskAction} from "../../shared/TaskAction.js";
import {TaskScheduler} from "./TaskScheduler.js";

export class GameServer {
    #botToken;
    #players;
    #sessions;
    #gameSteps = GameSteps.map(({number, multiplier}) => multiplier);
    #math = new GameMath(GameSteps);
    #taskScheduler;

    constructor(botToken, dbAdapter) {
        this.#botToken = botToken;
        this.#sessions = new GameSessionsManager(dbAdapter);
        this.#players = new PlayersManager(dbAdapter);
        this.#taskScheduler = new TaskScheduler(this.#players);

        this.#taskScheduler.startDailyTaskUpdaterByInterval(5);
    }

    async initSession(telegramInitData, invite) {
        const playerData = validateSignature(telegramInitData, this.#botToken);

        if (!playerData) {
            throw new ServerError('Invalid signature');
        }
        const playerID = playerData.user.id;
        const isPremium = playerData.user.is_premium;

        let player = await this.#players.getPlayer(playerID);

        if (!player) {
            player = await this.#players.createPlayer(playerID);

            if (invite && (invite !== playerID)) {
                await this.rewardForInviting(invite, playerID, isPremium);
            }
        } else {
            player.updateTaskOnAction(TaskAction.CLAIM_DAILY_REWARD);
            await this.#players.savePlayer(player);
        }

        const session = this.#sessions.getSession(playerID, player.session);
        const gameRound = session.getGameRoundInfo();

        if (player.session) {
           await this.#players.updatePlayer(playerID, {...player.toObject(), session: null});
        }

        return {
            id: session.id,
            steps: this.#gameSteps,
            gameRound,
            player: player.toObject()
        };
    }

    async rewardForInviting(invite, invited, isPremium) {
        const inviter = await this.#players.getPlayer(invite);
        const action = isPremium ? TaskAction.INVITE_FRIEND_PREMIUM : TaskAction.INVITE_FRIEND;

        if (inviter) {
            const tasks = inviter.updateTaskOnAction(action);

            if (tasks.length) {
                tasks.forEach(task => {
                    if (task.isReadyToClaim()) {
                        const reward = task.claimReward();

                        inviter.addBalance(reward);
                    }
                });
            }

            await this.#players.savePlayer(inviter);
        }
    }

    async placeBet(bet, sessionID, cheat) {
        const gameSession = this.#sessions.get(sessionID);

        if (!gameSession) {
            throw new SessionExpiredError();
        }

        const player = await this.#players.getPlayer(gameSession.playerID);

        if (!player) {
            throw new ServerError('Player not found');
        }

        if (player.balance < bet) {
            throw new ServerError('Not enough balance');
        }

        if (gameSession.hasGameRound()) {
            throw new ServerError('Current round is not completed!');
        }

        player.subBalance(bet);

        await this.#players.savePlayer(player);

        let cheatData = undefined;

        if (cheat && process.env.NODE_ENV === 'development') {
            cheatData = cheat;
        }

        gameSession.startGameRound(this.#math.getRandomGameRound(bet, cheatData));

        return {
            player: {
                balance: player.balance,
                luck: player.luck,
                level: player.level
            },
            gameRound: gameSession.getGameRoundInfo()
        };
    }

    async nextStep(sessionID) {
        const gameSession = this.#sessions.get(sessionID);

        if (!gameSession) {
            throw new SessionExpiredError();
        }

        if (!gameSession.hasGameRound()) {
            throw new ServerError('Not placed bet!');
        }

        const gameRound = gameSession.nextStep();

        if (gameRound.isWin || gameRound.isBonus) {
            const player = await this.#players.getPlayer(gameSession.playerID);

            if (gameRound.isBonus) {
                player.updateTaskOnAction(TaskAction.COLLECT_BONUS);
            }

            if (gameRound.isWin) {
                player.addBalance(gameRound.win);
                player.addLuck(gameRound.luck);
                player.level = this.#math.getLuckLevel(player.luck);

                player.updateTaskOnAction(TaskAction.PLAY_GAME);
            }

            await this.#players.savePlayer(player);
        }

        return {gameRound};
    }

    async cashOut(sessionID) {
        const gameSession = this.#sessions.get(sessionID);

        if (!gameSession) {
            throw new SessionExpiredError();
        }

        const player = await this.#players.getPlayer(gameSession.playerID);

        if (!player) {
            throw new ServerError('Player not found');
        }

        const result = gameSession.finishGameRound();

        if (result.isWin) {
            player.addBalance(result.win);
            player.addLuck(result.luck);
            player.level =this.#math.getLuckLevel(player.luck);

            player.updateTaskOnAction(TaskAction.PLAY_GAME);

            await this.#players.savePlayer(player);
        }

        return {
            player: player.toObject(),
            gameRound: result
        };
    }

    async saveState() {
        await this.#sessions.saveAll();
    }

    async getTasks(playerID) {
        const player = await this.#players.getPlayer(playerID);

        if (!player) {
            throw new ServerError('Player not found');
        }

        return player.getTasks();
    }

    async claimTaskReward(sessionID, taskId) {
        const gameSession = this.#sessions.get(sessionID);

        if (!gameSession) {
            throw new SessionExpiredError();
        }

        const player = await this.#players.getPlayer(gameSession.playerID);
        const task = player.getTask(taskId);

        if (!task) {
            throw new Error(`Task with ID ${taskId} not found for player.`);
        }

        if (!task.isReadyToClaim()) {
            throw new Error(`Task with ID ${taskId} is not ready to claim.`);
        }

        const reward = task.claimReward();
        player.addBalance(reward);

        await this.#players.savePlayer(player);

        return {
            success: true,
            reward:reward,
            task: task.toObject(),
            player: player.toObject()
        };
    }
}
