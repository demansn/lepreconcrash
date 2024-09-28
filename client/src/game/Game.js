import {manifest} from "../configs/resources-manifest";
import {Application, Assets} from 'pixi.js';

import { EventEmitter } from '@pixi/utils';
import {GameServer} from "../server/GameServer";
import {GamePlayScene} from "./GamePlayScene";
import {GAME_CONFIG} from "../configs/gameConfig";
import {app} from "./app";

class Game extends EventEmitter {
    ticker = null;
    constructor() {
        super();

        this.app = new Application();
        this.ticker = this.app.ticker;
        this.server = new GameServer();

        window.__PIXI_APP__ = this.app;
    }

    async init() {
        await this.app.init({
            ...GAME_CONFIG.size,
            backgroundColor: 0x1099bb
        });

        await Assets.init({ manifest });

        Assets.loadBundle('game', (progress) => {
            this.emit('assetsLoading', progress);
        }).then(() => {
            this.scene = new GamePlayScene(this.app);
            this.app.stage.addChild(this.scene);
            this.emit('assetsLoaded');
            this.scene.updateHUD(this.server.getInfo());
            this.startGame();
        });
    }

    async go() {
        const roundResult = this.server.nextStep();
        await this.scene.go(roundResult);
    }

    async startGame() {
        this.scene.waitPlaceBet();
        app.eventEmitter.on('hud:play:clicked', () => this.placeBet(10), this);
        app.eventEmitter.on('hud:cashOut:clicked', () => this.cashOut(), this);
        app.eventEmitter.on('hud:go:clicked', () => this.go(), this);
    }

    async cashOut() {
        const roundResult =  this.server.cashOut();

        this.scene.updateHUD(this.server.getInfo());
        this.scene.reset();

        return roundResult;
    }

    async placeBet(bet) {
        const round = this.server.placeBet(bet);
        app.version = !app.version;
        this.scene.reset();
        this.scene.updateHUD(this.server.getInfo());
        this.scene.play({bonusPlatform: round.bonus.step + 1 });
    }

    reset() {
        this.scene.reset();
    }

    getInfo() {
        return this.server.getInfo();
    }
}

export const game = new Game();
