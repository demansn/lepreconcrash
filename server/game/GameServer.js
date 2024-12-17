import {PlayersManager} from "./PlayersManager.js";
import {validateSignature} from "../utils.js";
import {GameSessionsManager} from "./GameSessionsManager.js";
import {GameMath} from "./GameMath.js";
import {GameSteps} from "./GameSteps.js";
import {SessionExpiredError} from "../errors/SessionExpiredError.js";
import {ServerError} from "../errors/ServerError.js";
import {TaskAction} from "../../shared/TaskAction.js";
import {TaskScheduler} from "./TaskScheduler.js";
import {ShopItems} from "./shop/ShopItems.js";
import {ServiceLocator} from "./ServiceLocator.js";
import {initDataToObj, validateEmail, validatePhoneNumber, validateTwitterAccount} from "../../shared/utils.js";
import {Buffer} from 'node:buffer';

const Logger = console;

export class GameServer {
    #botToken;
    #players;
    #sessions;
    #gameSteps = GameSteps.map(({number, multiplier}) => multiplier);
    #math = new GameMath(GameSteps);
    #taskScheduler;
    #isDev = false;

    constructor(botToken, dbAdapter, isDev) {
        this.#botToken = botToken;
        this.#sessions = new GameSessionsManager(dbAdapter);
        this.#isDev = isDev;
        this.#players = new PlayersManager(dbAdapter);
        this.#taskScheduler = new TaskScheduler(this.#players);

        this.#taskScheduler.startDailyTaskUpdaterAt();
        // this.#taskScheduler.startDailyTaskUpdaterByInterval(2);
    }

    async initSession(telegramInitData, invite) {
        const playerData = this.#isDev ? initDataToObj(telegramInitData) : validateSignature(telegramInitData, this.#botToken);

        if (!playerData) {
            Logger.log(`Invalid signature for data: ${telegramInitData}`);
            throw new ServerError('Invalid signature');
        }
        const user = playerData.user;
        const playerID = user.id;
        const isPremium = user.is_premium
        let player = await this.#players.getPlayer(playerID);

        if (!player) {
            player = await this.#players.createPlayer({
                id: playerID,
                balance: 100,
                luck: 0,
                level: 0,
                session: null,
                profile: {firstName: user.first_name, lastName: user.last_name, username: user.username, lang: user.language_code, isPremium: isPremium, photo: user.photo_url},
                tasks: []
            });

            Logger.log(`Player ${playerID} created`);

            if (invite && (invite !== playerID)) {
                await this.rewardForInviting(invite, playerID, isPremium);
            }

            player.updateTaskOnAction(TaskAction.CLAIM_DAILY_REWARD);
            await this.#players.savePlayer(player);
        } else {
            const task = player.updateTaskOnAction(TaskAction.CLAIM_DAILY_REWARD);

            if (task) {
                await this.#players.savePlayer(player);
            }
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
            shopItems: ShopItems,
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
                        const beforeBalance = inviter.balance;

                        inviter.addBalance(reward);

                        const afterBalance = inviter.balance;

                        Logger.log(`Player ${invite} claimed reward ${reward} for task ${task.id}, invited ${invited}, isPremium: ${isPremium} before b=${beforeBalance} after b=${afterBalance}`);
                    }
                });
            }

            await this.#players.savePlayer(inviter);
        }
    }

    async placeBet(bet, playerID, cheat) {
        const gameSession = await this.getSession(playerID);
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

        if (cheat && this.#isDev) {
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

    async nextStep(playerID) {
        const gameSession = await this.getSession(playerID);

        if (!gameSession.hasGameRound()) {
            throw new ServerError('Not placed bet!');
        }

        const gameRound = gameSession.nextStep();

        if (gameRound.isWin || gameRound.isLose) {
            const player = await this.#players.getPlayer(gameSession.playerID);

            if (gameRound.isWin) {
                player.updateTaskOnAction(TaskAction.COLLECT_BONUS);
                player.addBalance(gameRound.win);
                player.addLuck(gameRound.luck);
                player.level = this.#math.getLuckLevel(player.luck);
            }

            if (gameRound.isLose) {
                player.updateTaskOnAction(TaskAction.PLAY_GAME);
            }

            await this.#players.savePlayer(player);
        }

        return {gameRound};
    }

    async cashOut(playerID) {
        const gameSession = await this.getSession(playerID);

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

            if (result.isBonusCollected) {
                player.updateTaskOnAction(TaskAction.COLLECT_BONUS);
            }

            await this.#players.savePlayer(player);
        }

        return {
            player: player.toObject(),
            gameRound: result
        };
    }

    async getSession(playerID) {
        let gameSession = this.#sessions.get(playerID);

        if (!gameSession) {
            const player = await this.#players.getPlayer(playerID);

            if (player && player.session) {
                gameSession = this.#sessions.getSession(playerID, player.session);
            } else {
                throw new SessionExpiredError();
            }
        }

        return gameSession;
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

    async claimTaskReward(playerId, taskId) {
        const player = await this.#players.getPlayer(playerId);

        if (!player) {
            throw new Error(`Player with ID ${playerId} not found.`);
        }

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

        Logger.log(`Player ${playerId} claimed reward ${reward} for task ${taskId}`);

        return {
            success: true,
            reward:reward,
            task: task.toObject(),
            player: player.toObject()
        };
    }

    async getInvoiceLink(playerID, itemID) {
        const item = this.getShopItem(itemID);
        if (!item) {
            return false;
        }

        const data = {
            title: item.label,
            description: item.label,
            payload: JSON.stringify([playerID, itemID]),
            currency: 'XTR',
            prices: JSON.stringify([{amount: item.price, label: item.label}]),
        };
        const params = new URLSearchParams(data).toString();
        const response = await fetch(`https://api.telegram.org/bot${this.#botToken}/createInvoiceLink?${params}`);
        const {result} = await response.json();

        return result;
    }

    async fromTelegram(data) {
        if (data.message) {
            const {message} = data;
            const {successful_payment} = message;

            if (successful_payment) {
                try {
                    const {invoice_payload} = successful_payment;
                    const [playerID, itemID] = JSON.parse(invoice_payload);
                    const player = await this.#players.getPlayer(playerID);
                    const item = this.getShopItem(itemID);

                    if (player) {
                        player.addBalance(item.amount);

                        await this.#players.savePlayer(player);

                        const Logger = ServiceLocator.get('logger');

                        Logger.info(`Player ${playerID} bought ${item.amount} for ${item.price} XTR`);

                        return true;
                    }
                } catch(e) {
                    // reject payment

                }
            }
        }

        if (data.pre_checkout_query) {
            const {pre_checkout_query} = data;
            const body = {ok: true, pre_checkout_query_id:pre_checkout_query.id };
            const [_, itemID] = JSON.parse(pre_checkout_query.invoice_payload);
            const response = await fetch(
                `https://api.telegram.org/bot${this.#botToken}/answerPreCheckoutQuery`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                }
            );

            const Logger = ServiceLocator.get('logger');

            Logger.log(`Pre checkout query: ${pre_checkout_query.id} from ${pre_checkout_query.from.id} for buy ${itemID} item for ${pre_checkout_query.total_amount} XTR`);
        }

        return true;
    }

    getShopItem(id) {
        return ShopItems.find(item => item.id === id);
    }

    async getLeaderBoard(pagination = 20) {
        // TODO: implement pagination and sorting (request to db)
        let players =(await this.#players.getAllPlayers()).sort((a, b) => b.luck - a.luck).slice(0, pagination);

        return players.map(player => player.toObject()).map(player => {
            const fullName = `${player.profile.firstName} ${player.profile.lastName}`;
            const username = fullName || player.profile.username || 'Anonymous';
            const photo = player.profile.photo || '';
            const luck = player.luck;

            return {username, luck, photo};
        });
    }

    async applyTaskAction(playerID, taskAction, value) {
        const player = await this.#players.getPlayer(playerID);

        if (!player) {
            throw new ServerError('Player not found');
        }

        switch (taskAction) {
            case TaskAction.SHARE_EMAIL:
                if (!value || !validateEmail(value)) {
                    throw new Error('Invalid email format. Please use the format: user@domain.com.');
                }
                break;
            case TaskAction.SHARE_PHONE:
                if (!value || !validatePhoneNumber(value)) {
                    throw new Error('Invalid phone number format. Please use the international format: +1234567890 (up to 15 digits).');
                }
                break;
            case TaskAction.SHARE_X_ACCOUNT:
                if (!value || !validateTwitterAccount(value)) {
                    throw new Error('Invalid account format. Please use the format: @username.');
                }
                break;
        }

        const tasks = player.updateTaskOnAction(taskAction, value).map(task => task.toObject());

        await this.#players.savePlayer(player);

        return tasks;
    }

    async getUserPhoto(url) {
        try {
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const contentType = response.headers.get('content-type');

            return `data:${contentType};base64,${base64}`;
        } catch (error) {
            console.error('Ошибка при получении фото:', error);
            throw new Error('Не удалось получить изображение');
        }
    }
}
