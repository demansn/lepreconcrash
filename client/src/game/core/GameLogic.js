import {createAPI} from "../../Api.js";
import {TaskAction} from "../../../../shared/TaskAction.js";
import {initDataToObj, initDataToString} from "../../../../shared/utils.js";
import Tasks from "../../../../shared/task_templates.json"
import {TaskStatus} from "../../../../shared/TaskStatus.js";
import {SPIN_COST} from "../../../../shared/constants.js";

const INVITE_URL = 'https://t.me/share/url';

export class GameLogic {
    constructor(dependencies) {

        this.analytics = dependencies.resolve('AnalystService');
    }
    create(options) {
        this.api = createAPI(['initSession', 'placeBet', 'cashOut', 'nextStep', 'getTasks', 'claimTaskReward', 'getInvoiceLink', 'getLeaderBoard', 'applyTaskAction', 'getUserPhoto', 'checkTask', 'spin', 'watchAdsTask', 'openCookie'], API_URL);

        this.parameters = new URLSearchParams(window.location.search);
        this.platform = window.Telegram.WebApp.platform;

        this.isInTelegram = Boolean(window.Telegram.WebApp.initData);

        this.cheat = {
            bonusStep: this.parameters .has('bonusStep')  ? Number(this.parameters .get('bonusStep')) :  undefined,
            loseStep: this.parameters .has('loseStep')  ? Number(this.parameters .get('loseStep')) :  undefined,
            winStep: this.parameters .has('winStep')  ? Number(this.parameters .get('winStep')) :  undefined,
        };

        this.invite = this.parameters .has('tgWebAppStartParam') ? Number(this.parameters .get('tgWebAppStartParam')): undefined;

        if (ENV === 'dev') {
            this.invite = this.parameters .has('startapp') ? Number(this.parameters .get('startapp')): this.invite;
        }

        if (ENV !== 'dev') {
            this.cheat = undefined;
        }

        window.Telegram.WebApp.isVerticalSwipesEnabled = false;
        window.Telegram.WebApp.lockOrientation('portrait');

        this.userData = this.getUserData();
    }

    getUserData() {
        let  userData = window.Telegram.WebApp.initData;

        if (ENV === 'dev' && !userData) {
            userData = USER_DATA;

            if (this.parameters.has('userID')) {
                userData = initDataToObj(userData);

                userData.user.id = this.parameters.get('userID');

                userData = initDataToString(userData);
            }
        }

        return userData;
    }

    async initSession() {
        const {country} = await this.getGeoLocation();
        const medadata = {
            country,
            platform: this.platform
        };
        const {player, steps, id, gameRound, link, shopItems} = await this.api.initSession(this.userData, this.invite, medadata);

        try {
            await this.analytics.getProvider('TelemetreeProvider').initSession();
        } catch (e) {
            console.error(e);
        }

        this.sessionID = id;
        this.player = player;
        this.player.tasks = this.transformTasks(player.tasks);
        this.gameSteps = steps;

        this.gameRound = gameRound;
        this.shopItems = shopItems;

        if (player) {
            this.analytics.track('initSession', {
                balance: player.balance,
                luck: player.luck
            });
        }

        return {
            steps,
            player: player,
            gameRound,
            link
        };
    }

    async placeBet() {
        const {player, gameRound} = await this.api.placeBet(this.player.id, this.cheat);

        this.analytics.track('placeBet', {
            username: this.player.profile.username,
            playerId: this.player.id,
            balance: player.balance,
        });

        this.player.balance = player.balance;
        this.player.luck = player.luck;
        this.player.level = player.level;

        this.gameRound = gameRound;

        return {
            player,
            round:gameRound
        };
    }

    isBonusStep() {
        return this.gameRound && this.gameRound.bonus && this.gameRound.step === this.gameRound.bonus.step;
    }

    /**
     * Get bonus prize
     * @returns {[Prize, amount]}
     */
    getBonusPrize() {
        return this.gameRound.bonus.prize.split('-');
    }

    async nextStep() {
        const {gameRound} = await this.api.nextStep(this.player.id);

        this.gameRound = gameRound;

        const isWinBonusGame = gameRound.bonus && gameRound.bonus.prize && gameRound.step === gameRound.bonus.step;

        if (gameRound.isLose) {
            this.analytics.track('crash', {
                username: this.player.profile.username,
                playerId: this.player.id,
                step: gameRound.step
            });
        } else if (gameRound.isWin) {
            this.analytics.track('win', {
                username: this.player.profile.username,
                playerId: this.player.id,
                step: gameRound.step,
                win: gameRound.win,
                luck: gameRound.luck
            });

            if (gameRound.bonus && gameRound.bonus.prize) {
                this.analytics.track('win+bonusGame');
            }
        } else if(isWinBonusGame) {
            this.analytics.track('bonusGame');
        }

        return gameRound;
    }

    async cashOut() {
        const {player, gameRound} = await this.api.cashOut(this.player.id);

        let bonus = {};

        if (gameRound.step === gameRound.bonus.step) {
            bonus = {
                bonusStep: gameRound.bonus.step,
                bonusLuck: gameRound.bonus.luck
            };
        }

        this.analytics.track('cashOut', {
            step: gameRound.step,
            win: gameRound.win,
            luck: gameRound.luck,
            ...bonus
        });

        if (gameRound.bonus && gameRound.bonus.prize) {
            this.analytics.track('cashOut+bonusGame');
        }

        this.player.balance = player.balance;
        this.player.luck = player.luck;
        this.player.level = player.level;

        this.gameRound = null;

        return {player, gameRound};
    }

    getPlayerBalance() {
        return  {
            balance: this.player.balance,
            luck: this.player.luck,
            level: this.player.level
        }
    }

    getInfo() {
        return {
           ...this.player,
            round: this.gameRound ? this.gameRound : {win: 0, luck: 0, multiplier: 0, nextStepWin: 0},
        }
    }

    async getTasks() {
        const tasks = await this.api.getTasks(this.player.id);

        this.player.tasks = this.transformTasks(tasks);

        return this.player.tasks;
    }

    async claimTaskReward(taskId) {
        const result = await this.api.claimTaskReward(this.player.id, taskId);

        if (result.task) {
            this.player.balance = result.player.balance;
            result.task = this.transformTask(result.task);

            this.analytics.track('claim', {
                task: result.task.id,
                reward: result.task.reward
            });

            this.player.tasks = this.player.tasks.map(t => {
                if (t.id === taskId) {
                    return result.task;
                }

                return t;
            });
        }

        return result;
    }

    createInviteLink() {
        //https://t.me/share/url?url=https://t.me/catizenbot/gameapp?startapp=rp_38841232&text=
        const playerID = this.player.id;
        const url = decodeURIComponent(`${TELEGRAM_GAME_URL}?startapp=${playerID}`);
        const text = encodeURIComponent('Join me on a golden journey in Lappi GO—every step brings rewards! Start playing now >>');

        return `${INVITE_URL}?url=${url}&text=${text}`;
    }

    inviteFriend() {
        const inviteLink = this.createInviteLink();

        window.Telegram.WebApp.openTelegramLink(inviteLink);
    }

    async buyItem(itemID) {
        const link = await this.api.getInvoiceLink(this.player.id, itemID);

        if (!link) {
            return false;
        }

        const result = await this.#openInvoice(link);

        if (result) {
            this.player.balance = this.player.balance + this.shopItems[itemID].amount;

            this.analytics.track('buy', {
                price: this.shopItems[itemID].price,
                amount: this.shopItems[itemID].amount
            });
        }

        return result;
    }

    async applyTaskAction(task) {
        let error = null;

        if (task.actionRequired === TaskAction.SUBSCRIBE_TELEGRAM_CHANNEL) {
            window.Telegram.WebApp.openTelegramLink(task.metadata.url);
        }

        if (task.actionRequired === TaskAction.SUBSCRIBE_TWITTER) {
            window.Telegram.WebApp.openLink(task.metadata.url, {try_browser: true});
        }

        if (task.status === TaskStatus.IN_PROGRESS) {
            let tasksResult = await this.api.applyTaskAction(this.player.id, task.id);

            if (tasksResult && tasksResult.length) {
                tasksResult = this.transformTasks(tasksResult);

                this.player.tasks = this.player.tasks.map(t => {
                    if (t.id === task.id) {
                        return tasksResult.find(rt => rt.id === task.id);
                    }

                    return t;
                });
            }
            return tasksResult || [];
        }

        return [];
    }

    async watchAdsTask(task) {
        const tasks = await this.api.watchAdsTask(this.player.id, task.id);

        if (tasks && tasks.length) {
            const tasksResult = this.transformTasks(tasks);

            this.player.tasks = this.player.tasks.map(t => {
                if (t.id === task.id) {
                    return tasksResult.find(rt => rt.id === task.id);
                }

                return t;
            });

            return tasksResult;
        }

        return [];
    }

    async checkTask(task) {
        const tasks = await this.api.checkTask(this.player.id, task.id);

        if (tasks && tasks.length) {
            const tasksResult = this.transformTasks(tasks);

            this.player.tasks = this.player.tasks.map(t => {
                if (t.id === task.id) {
                    return tasksResult.find(rt => rt.id === task.id);
                }

                return t;
            });

            return tasksResult;
        }

        return [];
    }

    async update() {

    }

    async getLeaderBoard() {
        return await this.api.getLeaderBoard();
    }

    transformTasks(tasks) {
        return tasks.map(t => {
            const metaData =  Tasks.find(task => task.id === t.id) || {};

            return {...metaData, ...t};
        });
    }

    transformTask(task) {
        const metaData =  Tasks.find(t => t.id === task.id) || {};

        return {...metaData, ...task};
    }

    hasUserPhoto() {
        try {
            return window.Telegram.WebApp.initDataUnsafe.user.photo_url;
        } catch (e) {
            return false;
        }
    }

    async getProfilePhotoURL() {
        if (window.Telegram.WebApp.initDataUnsafe.user.photo_url) {
            return await this.api.getUserPhoto(window.Telegram.WebApp.initDataUnsafe.user.photo_url)
        }
    }

    async spin() {
        try {
            this.player.balance = this.player.balance - SPIN_COST;

            const {player, prize, amount, error, name, symbol, reward} = await this.api.spin(this.player.id);
            if (error) {
                this.showAlert('Error', error);
                return null;
            }

            this.player.balance = player.balance;
            this.player.luck = player.luck;
            this.player.level = player.level;

            return {prize, amount, symbol, reward, player};
        } catch (e) {

            this.showAlert('Error', e);
            return null;
        }
    }

    async openCookie() {
        try {
            if (this.player.balance < SPIN_COST) {
                this.showAlert('Error', 'Not enough balance');
                return '';
            }

            this.player.balance = this.player.balance - SPIN_COST;
            const {message, error, player} = await this.api.openCookie(this.player.id);

            this.player.balance = player.balance;
            this.player.luck = player.luck;
            this.player.level = player.level;

            if (error) {
                this.showAlert('Error', error);
                return '';
            }

            return message;
        } catch (e) {
            this.showAlert('Error', e);
            return '';
        }
    }

    async #openInvoice(link) {
        return new Promise(resolve => {
            window.Telegram.WebApp.openInvoice(link, (e) => {
                if (e === 'paid') {
                    resolve(true);

                } else {
                    resolve(false);
                }
            }) ;
        });
    }

    getBalance() {
        return this.player.balance;
    }

    getUserName() {
        const fullName = this.player.profile.firstName + ' ' + this.player.profile.lastName;

        return fullName ||  this.player.profile.username || 'User';
    }

    showAlert(title, message) {
        if (this.isInTelegram) {
            window.Telegram.WebApp.showAlert(title, message);
        } else {
            alert(message);
        }
    }

    async getGeoLocation() {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        return {
            country: data.country_code,
            region: data.region,
            city: data.city,
        };
    }
}
