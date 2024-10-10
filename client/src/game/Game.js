import {manifest} from "../configs/resources-manifest";
import {Application, Assets} from 'pixi.js';

import { EventEmitter } from '@pixi/utils';
import {GameServer} from "../server/GameServer";
import {GamePlayScene} from "./GamePlayScene";
import {GAME_CONFIG} from "../configs/gameConfig";
import {app} from "./app";
import {Stage} from "@pixi/layers";
import {layers} from "./ObjectFactory";
import {sound} from "@pixi/sound";

class Game extends EventEmitter {
    ticker = null;
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

        this.server = new GameServer();

        window.__PIXI_APP__ = this.app;
    }

    async init() {
        await Assets.init({ manifest });

        Assets.loadBundle('game', (progress) => {
            this.emit('assetsLoading', progress);
        }).then(() => {
            this.scene = new GamePlayScene(this.app);
            this.app.stage.addChild(this.scene);
            this.emit('assetsLoaded');
            this.scene.updateHUD(this.server.getInfo());
            this.startGame();
            sound.play('mainMusic', {loop: true});
        });
    }

    async go() {
        const roundResult = this.server.nextStep();
        const info = roundResult.isWin ? this.server.getInfo() : null;

        await this.scene.go(roundResult, info);
    }

    async startGame() {
        this.scene.waitPlaceBet();

        app.eventEmitter.on('hud:play:clicked', () => this.placeBet(10), this);
        app.eventEmitter.on('hud:cashOut:clicked', () => this.cashOut(), this);
        app.eventEmitter.on('hud:go:clicked', () => this.go(), this);
    }

    async cashOut() {
        const roundResult =  this.server.cashOut();

        this.scene.cashOut(this.server.getInfo(), roundResult).add(() => {
            this.scene.reset();
        });
    }

    async placeBet(bet) {
        const round = this.server.placeBet(bet);
        app.version = !app.version;
        this.scene.updateHUD(this.server.getInfo());
        this.scene.play({bonusPlatform: round.bonus.step + 1, nextStepWin: round.nextStepWin});
    }

    reset() {
        this.scene.reset();
    }

    getInfo() {
        return this.server.getInfo();
    }
}

export const game = new Game();
