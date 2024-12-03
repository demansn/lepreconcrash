import {createAPI} from "../../Api.js";
import {TaskAction} from "../../../../shared/TaskAction.js";
import {validateEmail, validatePhoneNumber, validateTwitterAccount} from "../../../../shared/utils.js";

const INVITE_URL = 'https://t.me/share/url';
// TODO: move to .env
// const API_URL = 'https://99e62295e3f6.ngrok.app';

export class GameLogic {
    create(options) {
        this.api = createAPI(['initSession', 'placeBet', 'cashOut', 'nextStep', 'getTasks', 'claimTaskReward', 'getInvoiceLink', 'getLeaderBoard'], API_URL);

        const urlParams = new URLSearchParams(window.location.search);

        this.cheat = {
            bonusStep: urlParams.has('bonusStep')  ? Number(urlParams.get('bonusStep')) :  undefined,
            loseStep: urlParams.has('loseStep')  ? Number(urlParams.get('loseStep')) :  undefined,
            winStep: urlParams.has('winStep')  ? Number(urlParams.get('winStep')) :  undefined,
        };

        this.invite = urlParams.has('tgWebAppStartParam') ? Number(urlParams.get('tgWebAppStartParam')): undefined;

        if (ENV !== 'dev') {
            this.cheat = undefined;
        }

        this.userData = this.getUserData();
    }

    getUserData() {
        let  userData = window.Telegram.WebApp.initData;

        if (ENV === 'dev' && !userData) {
            userData = USER_DATA;
        }

        return userData;
    }

    async initSession() {
        const {player, steps, id, gameRound, link, shopItems} = await this.api.initSession(this.userData, this.invite);

        this.sessionID = id;
        this.player = player;
        this.gameSteps = steps;

        this.gameRound = gameRound;
        this.shopItems = shopItems;

        return {
            steps,
            player: player,
            gameRound,
            link
        }
    }

    async placeBet(bet) {
        const {player, gameRound} = await this.api.placeBet(bet, this.sessionID, this.cheat);

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
        const {gameRound} = await this.api.nextStep(this.sessionID);

        this.gameRound = gameRound;

        return gameRound;
    }

    async cashOut() {
        const {player, gameRound} = await this.api.cashOut(this.sessionID);

        this.player.balance = player.balance;
        this.player.luck = player.luck;
        this.player.level = player.level;

        this.gameRound = null;

        return {player, gameRound};
    }

    getInfo() {
        return {
           ...this.player,
            round: this.gameRound ? this.gameRound : {win: 0, luck: 0, multiplier: 0, nextStepWin: 0},
        }
    }

    async getTasks() {
        return await this.api.getTasks(this.player.id);
    }

    claimTaskReward(taskId) {
        const result = this.api.claimTaskReward(this.sessionID, taskId);

        if (result.task) {
            this.player.balance = result.player.balance;
        }

        return result;
    }

    createInviteLink() {
        //https://t.me/share/url?url=https://t.me/catizenbot/gameapp?startapp=rp_38841232&text=
        const playerID = 432530856; //this.player.id;
        const url = decodeURIComponent(`${TELEGRAM_GAME_URL}?startapp=${playerID}`);
        const text = encodeURIComponent('Join the game!');

        return `${INVITE_URL}?url=${url}&text=${text}`;
    }

    inviteFriend() {
        const inviteLink = this.createInviteLink();

        window.Telegram.WebApp.openLink(inviteLink);
    }

    async buyItem(itemID) {
        const link = await this.api.getInvoiceLink(this.player.id, itemID);

        if (!link) {
            return false;
        }

        const result = await this.#openInvoice(link);

        if (result) {
            this.player.balance = this.player.balance + this.shopItems[itemID].amount;
        }

        return result;
    }

    async applyTaskAction(task, value) {
        let error = null;

        if (task.actionRequired === TaskAction.SHARE_EMAIL && (!value || validateEmail(value))) {
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

        return false;

        // const result = await this.api.applyTaskAction(this.player.id, task.id, value);
        //
        // return result;
    }

    async update() {

    }

    async getLeaderBoard() {
        return await this.api.getLeaderBoard();
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
}
