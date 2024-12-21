import {createAPI} from "../../Api.js";
import {TaskAction} from "../../../../shared/TaskAction.js";
import {initDataToObj, initDataToString, validateEmail, validatePhoneNumber, validateTwitterAccount} from "../../../../shared/utils.js";
import Tasks from "../../../../shared/task_templates.json"

const INVITE_URL = 'https://t.me/share/url';

export class GameLogic {
    constructor(dependencies) {

        this.analytics = dependencies.resolve('AnalystService');
    }
    create(options) {
        this.api = createAPI(['initSession', 'placeBet', 'cashOut', 'nextStep', 'getTasks', 'claimTaskReward', 'getInvoiceLink', 'getLeaderBoard', 'applyTaskAction', 'getUserPhoto'], API_URL);

        this.parameters = new URLSearchParams(window.location.search);

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
        const {player, steps, id, gameRound, link, shopItems} = await this.api.initSession(this.userData, this.invite);

        this.sessionID = id;
        this.player = player;
        this.player.tasks = this.transformTasks(player.tasks);

        this.gameSteps = steps;

        this.gameRound = gameRound;
        this.shopItems = shopItems;

        this.analytics.track('initSession', {
            username: player.profile.username,
            playerId: player.id,
            balance: player.balance,
            luck: player.luck
        });

        return {
            steps,
            player: player,
            gameRound,
            link
        };
    }

    async placeBet(bet) {
        const {player, gameRound} = await this.api.placeBet(bet, this.player.id, this.cheat);

        this.analytics.track('placeBet', {
            username: this.player.profile.username,
            playerId: this.player.id
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

    async nextStep() {
        const {gameRound} = await this.api.nextStep(this.player.id);

        this.gameRound = gameRound;

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
        }

        return gameRound;
    }

    async cashOut() {
        const {player, gameRound} = await this.api.cashOut(this.player.id);

        this.analytics.track('cashOut', {
            username: player.profile.username,
            playerId: player.id,
            step: gameRound.step,
            win: gameRound.win,
            luck: gameRound.luck
        });

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
                username: this.player.profile.username,
                playerId: this.player.id,
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
                username: this.player.profile.username,
                playerId: this.player.id,

                amount: this.shopItems[itemID].amount
            });
        }

        return result;
    }

    async applyTaskAction(task, value) {
        let error = null;

        if (task.actionRequired === TaskAction.SHARE_EMAIL && (!value || !validateEmail(value))) {
            error = 'Invalid email format. Please use the format: name@domain.com.';
        }

        if (task.actionRequired === TaskAction.SHARE_PHONE && (!value || !validatePhoneNumber(value))) {
            error = 'Invalid phone number format. Please use the international format: +1234567890 (up to 15 digits).';
        }

        if (task.actionRequired === TaskAction.SHARE_X_ACCOUNT && (!value || !validateTwitterAccount(value))) {
            error = 'Invalid account format. Please use the format: @username.';
        }

        if (error) {
            try {
                window.Telegram.WebApp.showAlert(error);
            } catch {
                alert(error);
            }
            return false;
        }

        let tasksResult = await this.api.applyTaskAction(this.player.id, task.actionRequired, value);

        if (tasksResult) {
            tasksResult = this.transformTasks(tasksResult);

            this.player.tasks = this.player.tasks.map(t => {
                if (t.id === task.id) {
                    return tasksResult.find(rt => rt.id === task.id);
                }

                return t;
            });
        }

        return tasksResult;
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

    getUserName() {
        const fullName = this.player.profile.firstName + ' ' + this.player.profile.lastName;

        return fullName ||  this.player.profile.username || 'User';
    }
}
