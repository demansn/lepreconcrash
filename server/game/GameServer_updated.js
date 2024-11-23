import {PlayersManager} from "./PlayersManager.js";
import {validateSignature} from "../utils.js";
import {GameSessionsManager} from "./GameSessionsManager.js";
import {GameMath} from "./GameMath.js";
import {GameSteps} from "./GameSteps.js";
import {SessionExpiredError} from "../errors/SessionExpiredError.js";
import {ServerError} from "../errors/ServerError.js";

export class GameServer {
    #botToken;
    #players;
    #sessions;
    #gameSteps = GameSteps.map(({number, multiplier}) => multiplier);
    #math = new GameMath(GameSteps);

    constructor(botToken, dbAdapter) {
        this.#botToken = botToken;
        this.#sessions = new GameSessionsManager(dbAdapter);
        this.#players = new PlayersManager(dbAdapter);

    async getPlayerTasks(sessionID) {
        // Load tasks from the JSON file (simulate database for development purposes)
        const fs = require('fs');
        const tasksPath = './task_templates.json';

        if (!fs.existsSync(tasksPath)) {
            throw new Error('Task templates file not found.');
        }

        const tasksData = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));

        // Filter necessary fields for the player
        const playerTasks = tasksData.map(task => ({
            id: task._id,
            type: task.type,
            title: task.title,
            description: task.description,
            reward: task.reward,
            goal: task.goal,
            isRepeatable: task.isRepeatable
        }));

        return playerTasks;
    }
    }

    async initSession(telegramInitData) {
        const playerData = validateSignature(telegramInitData, this.#botToken);

        if (!playerData) {
            throw new ServerError('Invalid signature');
        }

        const player = await this.#players.getPlayer(playerData.user.id);
        const session = this.#sessions.getSession(player.id, player.session);
        const gameRound = session.getGameRoundInfo();

        if (player.session) {
            this.#players.updatePlayer(player.id, {session: null});
        }

        return {
            id: session.id,
            steps: this.#gameSteps,
            gameRound,
            player: player.toObject()
        };
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
}
