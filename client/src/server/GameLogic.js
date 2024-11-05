import {createAPI} from "../Api";

// TODO: move to .env
// const API_URL = 'https://99e62295e3f6.ngrok.app';

export class GameLogic {
    constructor() {
        this.api = createAPI(['initSession', 'placeBet', 'cashOut', 'nextStep'], API_URL);

        const urlParams = new URLSearchParams(window.location.search);

        this.cheat = {
            bonusStep: urlParams.has('bonusStep')  ? Number(urlParams.get('bonusStep')) :  undefined,
            loseStep: urlParams.has('loseStep')  ? Number(urlParams.get('loseStep')) :  undefined,
            winStep: urlParams.has('winStep')  ? Number(urlParams.get('winStep')) :  undefined,
        };

        if (ENV !== 'dev') {
            this.cheat = undefined;
        }
    }

    async initSession(playerData) {
        const {player, steps, id, gameRound} = await this.api.initSession(playerData);

        this.sessionID = id;
        this.player = player;
        this.gameSteps = steps;

        this.gameRound = gameRound;

        return {
            steps,
            player: player,
            gameRound
        }
    }

    async placeBet(bet) {
        const {player, gameRound} = await this.api.placeBet(bet, this.sessionID, this.cheat);

        this.player = player;
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
}
