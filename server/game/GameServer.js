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
import {initDataToObj} from "../../shared/utils.js";
import {Buffer} from 'node:buffer';
import {GameShop} from "./GameShop.js";
import {TaskStatus} from "../../shared/TaskStatus.js";
import {PrizeType} from "../../shared/PrizeType.js";
import {SlotMachinePrizes} from "../configs/SlotMachinePrizes.js";
import {SPIN_COST} from "../../shared/constants.js";

const DEFAULT_BET = 10;
const Logger = console;

export class GameServer {
    #botToken;
    #players;
    #sessions;
    #gameSteps = GameSteps.map(({number, multiplier}) => multiplier);
    #math = new GameMath(GameSteps, SlotMachinePrizes);
    #taskScheduler;
    /**
     * @type {GameShop}
     */
    #shop;
    #isDev = false;
    /**
     * @type {AnalystService}
     */
    #analytics;

    constructor(botToken, dbAdapter, isDev, clientURL, chanel) {
        this.#botToken = botToken;
        this.#sessions = new GameSessionsManager(dbAdapter);
        this.#isDev = isDev;
        this.#players = new PlayersManager(dbAdapter);
        this.#shop= new GameShop(dbAdapter, botToken, clientURL);
        this.#taskScheduler = new TaskScheduler(this.#players);
        this.clientURL = clientURL;
        this.#analytics = ServiceLocator.get('analytics');
        this.chanel = chanel;
    }

    async initSession(telegramInitData, invite, metadata) {
        try {
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
                    gameCounter: {
                        total: 0,
                        wins: 0,
                        loses: 0
                    },
                    metadata,
                    profile: {
                        firstName: user.first_name,
                        lastName: user.last_name,
                        username: user.username,
                        lang: user.language_code,
                        isPremium: isPremium
                    },
                    tasks: []
                });

                Logger.log(`Player ${playerID} created`);
                // this.track('newUser', {playerId: playerID, username: user.username});

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

            const session = this.#sessions.getSession(playerID, player.session, player.gameCounter.total);
            const gameRound = session.getGameRoundInfo();

            if (player.session) {
                await this.#players.updatePlayer(playerID, {...player.toSaveObject(), session: null});
            }

            return {
                id: session.id,
                steps: this.#gameSteps,
                gameRound,
                shopItems: ShopItems,
                player: player.toClient()
            };
        } catch (e) {
            Logger.error(`Failed to init session: ${e}`);
            throw e;
        }
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
                        // this.track('claim', {task: task.id, reward});
                    }
                });
            }

            await this.#players.savePlayer(inviter);
        }
    }

    async placeBet(playerID, cheat) {
        const bet = DEFAULT_BET;
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

            if (gameRound.isLose || gameRound.isWin) {
                player.addGame(gameRound.isWin || false);
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
            player.level = this.#math.getLuckLevel(player.luck);

            player.addGame(true);
            player.updateTaskOnAction(TaskAction.PLAY_GAME);

            if (result.isBonusCollected) {
                player.updateTaskOnAction(TaskAction.COLLECT_BONUS);
            }

            await this.#players.savePlayer(player);
        }

        return {
            player: player.toClient(),
            gameRound: result
        };
    }

    async getSession(playerID) {
        let gameSession = this.#sessions.get(playerID);

        if (!gameSession) {
            const player = await this.#players.getPlayer(playerID);

            if (player && player.session) {
                gameSession = this.#sessions.getSession(playerID, player.session, player.gameCounter.total);
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
            task: task.toClient(),
            player: player.toClient()
        };
    }

    async getInvoiceLink(playerID, itemID) {
        const session = await this.getSession(playerID);

        return await this.#shop.getInvoiceLink(playerID, itemID, session.gameNumber);
    }

    async fromTelegram(data) {
        if (data.message) {
            console.log(data);
            const {message} = data;
            const {successful_payment} = message;

            if (successful_payment) {
                this.trackUpdate(data);
                try {
                    const {invoice_payload, telegram_payment_charge_id, order_info} = successful_payment;
                    const [playerID, itemID, purchaseId] = JSON.parse(invoice_payload);
                    const player = await this.#players.getPlayer(playerID);
                    const item = this.#shop.getShopItem(itemID);

                    if (player) {
                        player.addBalance(item.amount);

                        await this.#players.savePlayer(player);

                        const Logger = ServiceLocator.get('logger');

                       await this.#shop.confirmPurchase(purchaseId, {paymentID: telegram_payment_charge_id});
                        Logger.info(`Player ${playerID} bought ${item.amount} for ${item.price} XTR , purchaseId: ${purchaseId}`);

                        return true;
                    }
                } catch(e) {
                    Logger.error(`Failed to process payment: ${e} for data: ${JSON.stringify(data)}`);
                }
            }
        }

        if (data.pre_checkout_query) {
            this.trackUpdate(data);
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

    async getLeaderBoard() {
       return await this.#players.getTopPlayer();
    }

    async applyTaskAction(playerID, taskID) {
        const player = await this.#players.getPlayer(playerID);

        if (!player) {
            throw new ServerError('Player not found');
        }

        const task = player.getTask(taskID);

        if (!task) {
            throw new ServerError('Task not found');
        }

        if (task.actionRequired === TaskAction.SUBSCRIBE_TELEGRAM_CHANNEL || task.actionRequired === TaskAction.SUBSCRIBE_TWITTER && task.isInProgress()) {
            const task = player.updateTaskStatus(taskID, TaskStatus.NEED_CHECK).toClient();

            await this.#players.savePlayer(player);

            return [task];
        }

        return [];
    }

    async watchAdsTask(playerID, taskID) {
        const player = await this.#players.getPlayer(playerID);

        if (!player) {
            throw new ServerError('Player not found');
        }

        const task = player.getTask(taskID);

        if (!task) {
            throw new ServerError('Task not found');
        }

        if (task.actionRequired === TaskAction.WATCH_AD && task.isInProgress()) {
            const tasks = player.updateTaskOnAction(TaskAction.WATCH_AD);

            await this.#players.savePlayer(player);

            return tasks.map(t => t.toClient());
        }

        return [];
    }

    async checkTask(playerID, taskID) {
        const player = await this.#players.getPlayer(playerID);

        if (!player) {
            throw new ServerError('Player not found');
        }

        const task = player.getTask(taskID);

        if (!task) {
            throw new ServerError('Task not found');
        }

        if (task.actionRequired === TaskAction.SUBSCRIBE_TELEGRAM_CHANNEL || task.actionRequired === TaskAction.SUBSCRIBE_TWITTER && task.isInNeedToCheck()) {
            let isSubscribed = false;
            if (task.actionRequired === TaskAction.SUBSCRIBE_TWITTER) {
                isSubscribed = true;
            }

            if (task.actionRequired === TaskAction.SUBSCRIBE_TELEGRAM_CHANNEL) {
                const {subscribed} = await this.checkTelegramSubscription(playerID);
                isSubscribed = subscribed;
            }

            if (isSubscribed) {
                const tasks = player.updateTaskOnAction(task.actionRequired);

                if (tasks.length) {
                    await this.#players.savePlayer(player);
                }

                return tasks.map(t => t.toClient());
            }
        }

        return [];
    }

    async spin(playerID) {
        const bet = SPIN_COST;
        const player = await this.#players.getPlayer(playerID);
        const reward = {
            win: 0,
            luck: 0,
            stars: 0,
            bet,
        }

        if (!player) {
            throw new ServerError('Player not found');
        }

        if (player.balance < bet) {
            throw new ServerError('Not enough balance');
        }

        player.subBalance(bet);

        const {prize, amount, symbol} = this.#math.getPrize();

        switch(prize) {
            case PrizeType.GOLD:
                player.addBalance(amount);
                reward.win = amount;
                break;
            case PrizeType.LUCK:
                player.addLuck(amount);
                player.level = this.#math.getLuckLevel(player.luck);
                reward.luck = amount;
                break;
            case PrizeType.STAR:
                // TODO: add stars for telegram user
                break;
        }

        await this.#players.savePlayer(player);

        return {
            player: {
                balance: player.balance,
                luck: player.luck,
                level: player.level
            },
            prize,
            amount,
            symbol,
            reward
        };
    }

    async getUserPhoto(url) {
        try {
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const contentType = response.headers.get('content-type');

            return `data:${contentType};base64,${base64}`;
        } catch (error) {
            Logger.error(`Failed to get user photo from url: ${url}, error: ${error}`);
            return '';
        }
    }

    async track(event, data) {
        try {
             await this.#analytics.track(event, data);
        } catch (e) {
            Logger.error(`Failed to track event: ${event}, data: ${JSON.stringify(data)}, error: ${e}`);
        }
    }

    async trackUpdate(data) {
        const {message} = data;
        try {
            if (message && message.from && message.from.id) {
                this.#analytics.getProvider('telemetree').trackUpdate(data);
            }
        } catch (e) {
            Logger.error(`Failed to track update: ${e}`);
        }
    }

    // async takeStars(playerID, amount) {
    //     const url = `https://api.telegram.org/bot${this.#botToken}/sendInvoice`;
    //     const params = {
    //         chat_id: playerID,
    //         title: "Подарок звезд",
    //         description: `Ты получил ${amount} звезд!`,
    //         payload: JSON.stringify({ type: "gift", amount }),
    //         currency: "XTR",
    //         prices: [{ label: "Звезды", amount}],
    //     };
    //
    //     try {
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(params),
    //         });
    //
    //         const data = await response.json();
    //
    //         console.log(data);
    //
    //         if (data.ok) {
    //             return true;
    //         } else {
    //             throw new Error(data.description);
    //         }
    //     } catch (error) {
    //         console.error("Error taking stars:", error);
    //         return false;
    //     }
    // }

    async checkTelegramSubscription(playerID) {
        const url = `https://api.telegram.org/bot${this.#botToken}/getChatMember?chat_id=${this.chanel}&user_id=${playerID}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.ok) {
                const status = data.result.status;
                if (status === "member" || status === "administrator" || status === "creator") {
                    return { subscribed: true, status };
                } else {
                    return { subscribed: false, status };
                }
            } else {
                throw new Error(data.description);
            }
        } catch (error) {
            console.error("Error checking subscription:", error);
            return { subscribed: false, error: error.message };
        }
    }
}
