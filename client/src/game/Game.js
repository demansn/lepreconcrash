import {manifest} from "../configs/resources-manifest";
import {Application, Assets} from 'pixi.js';

import { EventEmitter } from '@pixi/utils';
import {GameLogic} from "../server/GameLogic";
import {GamePlayScene} from "./GamePlayScene";
import {GAME_CONFIG} from "../configs/gameConfig";
import {app} from "./app";
import {Stage} from "@pixi/layers";
import {layers} from "./ObjectFactory";
import {sound} from "@pixi/sound";
import {toFixed} from "./utils";
import {createAPI} from "../Api";

/**
 * @typedef
 *
 */

class Game extends EventEmitter {
    ticker = null;
    /**
     * @type {Object}
     * @function initSession(playerData)
     */
    api = null;
    constructor() {
        super();

        this.app = new Application({
            ...GAME_CONFIG.size,
            backgroundColor: 0x1099bb,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
        });
        this.app.stage = new Stage();
        this.app.stage.sortableChildren = true;



        // window.__PIXI_DEVTOOLS__ = {
        //     app: this.app,
        // };

        window.__PIXI_APP__ = this.app;

        layers.forEach((layer) => {
            if (layer) {
                this.app.stage.addChild(layer);
            }
        });

        this.ticker = this.app.ticker;

        this.logic = new GameLogic();

        window.__PIXI_APP__ = this.app;
    }

    async init() {
        await Assets.init({ manifest });

         await this.logic.initSession(window.Telegram.WebApp.initData);

        Assets.loadBundle('game', (progress) => {
            this.emit('assetsLoading', toFixed(progress));
        }).then(() => {
            this.scene = new GamePlayScene(this.app, {steps: this.logic.steps});
            this.app.stage.addChild(this.scene);
            this.emit('assetsLoaded');
            this.scene.updateHUD(this.logic.getInfo());
            this.startGame();
            sound.play('mainMusic', {loop: true});
        });
    }

    async startGame() {
        this.scene.waitPlaceBet();

        app.eventEmitter.on('hud:play:clicked', () => this.placeBet(10), this);
        app.eventEmitter.on('hud:cashOut:clicked', () => this.cashOut(), this);
        app.eventEmitter.on('hud:go:clicked', () => this.go(), this);
    }

    async placeBet(bet) {
        const {round} = await this.logic.placeBet(bet);

        app.version = !app.version;
        this.scene.updateHUD(this.logic.getInfo());
        this.scene.play({bonusPlatform: round.bonus.step + 1, nextStepWin: round.nextStepWin});
    }

    async go() {
        const roundResult = await this.logic.nextStep();
        const info = roundResult.isWin ? this.logic.getInfo() : null;

        await this.scene.go(roundResult, info);
    }

    async cashOut() {
        const {gameRound} = await this.logic.cashOut();

        this.scene.cashOut(this.logic.getInfo(), gameRound).add(() => {
            this.scene.reset();
        });
    }

    reset() {
        this.scene.reset();
    }

    getInfo() {
        return this.server.getInfo();
    }
}

export const game = new Game();
