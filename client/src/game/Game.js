import {manifest} from "../configs/resources-manifest";
import {Application, Assets} from 'pixi.js';
import { EventEmitter } from '@pixi/utils';
import {GameServer} from "../server/GameServer";
import {GamePlayScene} from "./GamePlayScene";

class Game extends EventEmitter {
    ticker = null;
    constructor() {
        super();

        this.app = new Application();
        this.ticker = this.app.ticker;
        this.server = new GameServer();
    }

    async init() {
        await this.app.init({
            width: 712,
            height: 1280,
            backgroundColor: 0x1099bb
        });

        await Assets.init({ manifest });

        Assets.loadBundle('game', (progress) => {
            this.emit('assetsLoading', progress);
        }).then(() => {
            this.scene = new GamePlayScene(this.app);
            this.scene.setText('Place bet!');
            this.app.stage.addChild(this.scene);
            this.emit('assetsLoaded');
        });
    }

    async go() {
        const roundResult = this.server.nextStep();
        this.updateInfo(roundResult);

        await this.scene.heroJumpTo(roundResult.step, roundResult.isLose, roundResult.isWin, roundResult.isBonus);

        return roundResult;
    }

    async cashOut() {
        const roundResult =  this.server.cashOut();
        this.updateInfo(roundResult);

        return roundResult;
    }

    async placeBet(bet) {
        const round = this.server.placeBet(bet);

        this.scene.reset();
        this.scene.setBonusToPlatform(round.bonus.step + 1);

        this.updateInfo(round);
    }

    reset() {
        this.scene.reset();
        this.scene.setText('Place bet!');
    }

    updateInfo(round) {
        if (round) {
            if (round.isLose) {
                this.scene.setText(`You lose on step: ${round.step}`);
            } else  if (round.isWin) {
                this.scene.setText(`You win: ${round.totalWin}`);
            } else {
                this.scene.setText(`
                Current round step: ${round.step}
                Possible winnings: ${round.win}
                Bonus in step: ${round.bonus && round.bonus.step + 1}
                Bonus luck: ${round.bonus && round.bonus.luck}
                Current multiplier: ${round.multiplier}
            `);
            }
        }
    }

    getInfo() {
        return this.server.getInfo();
    }

    isState() {

    }

    pause() {
        this.ticker.stop();
    }

    resume() {
        this.ticker.start();
    }

    resizeTo(width, height) {
        this.app
    }
}

export const game = new Game();
