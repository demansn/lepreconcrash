import {manifest} from "../configs/resources-manifest";
import {Application, Assets, Container} from 'pixi.js';
import { EventEmitter } from '@pixi/utils';
import {GameLogic} from "../server/GameLogic";
import {GamePlayScene} from "./GamePlayScene";
import {GAME_CONFIG} from "../configs/gameConfig";
import {app} from "./app";
import {Stage} from "@pixi/layers";
import {layers, SuperContainer} from "./ObjectFactory";
import {sound} from "@pixi/sound";
import {toFixed} from "./utils";
import {PopupManager} from "./lib/PopupManager.js";
import {ResultPopup} from "./popup/ResultPopup.js";
import {SessionExpired} from "./popup/SessionExpired.js";
import {MessagePopup} from "./popup/MessagePopup.js";

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

    getUserData() {
        let  userData = window.Telegram.WebApp.initData;

        if (ENV === 'dev' && !userData) {
            userData = USER_DATA;
        }

        return userData;
    }

    async init() {
         await Assets.init({ manifest });
         await this.logic.initSession(this.getUserData());

        Assets.loadBundle('game', (progress) => {
            this.emit('assetsLoading', toFixed(progress));
        }).then(this.onLoadedResources.bind(this));
    }

    onLoadedResources() {
        this.baseContainer = new SuperContainer();
        this.app.stage.addChild(this.baseContainer);

        this.popupManager = this.baseContainer.create.displayObject(PopupManager, {
            gameSize: this.app.screen,
            visible: true,
            layer: 'popup',
            popups: [
                SessionExpired,
                MessagePopup
            ]
        });
        this.scene = new GamePlayScene(this.app);
        this.app.stage.addChild(this.scene);
        this.emit('assetsLoaded');
        this.start();

        // sound.play('mainMusic', {loop: true});
    }

    start() {
        this.scene.updateHUD(this.logic.getInfo());

        if (this.logic.gameRound) {
            this.restoreGame();
        } else {
            this.startGame();
        }
    }

    startGame() {
        this.scene.waitPlaceBet();
        this.addEventListeners();
    }

    restoreGame() {
        this.scene.restore(this.logic.gameRound);
        this.scene.updateHUD(this.logic.getInfo());
        this.addEventListeners();
    }

    addEventListeners() {
        app.eventEmitter.on('hud:play:clicked', () => this.placeBet(10), this);
        app.eventEmitter.on('hud:cashOut:clicked', () => this.cashOut(), this);
        app.eventEmitter.on('hud:go:clicked', () => this.go(), this);

        app.eventEmitter.on('popups:show', this.popupManager.showPopup, this.popupManager);
    }

    removeEventListeners() {
        app.eventEmitter.off('hud:play:clicked');
        app.eventEmitter.off('hud:cashOut:clicked');
        app.eventEmitter.off('hud:go:clicked');
        app.eventEmitter.off('popups:show');
    }

    async placeBet(bet) {
        try {
            const {round} = await this.logic.placeBet(bet);

            app.version = !app.version;
            this.scene.updateHUD(this.logic.getInfo());
            this.scene.play(round);
        } catch (e) {
            this.error(e);
        }
    }

    async go() {
        try {
            const roundResult = await this.logic.nextStep();
            const info = roundResult.isWin ? this.logic.getInfo() : null;

            await this.scene.go(roundResult, info);
        } catch (e) {
            this.error(e);
        }
    }

    async cashOut() {
        try {
            const {gameRound} = await this.logic.cashOut();

            this.scene.cashOut(this.logic.getInfo(), gameRound).add(() => {
                this.scene.reset();
            });
        } catch (e) {
            this.error(e);
        }
    }

    error(e) {
        if (e.name === 'session-expired') {
            this.showSessionExpiredPopup();
        } else {
            this.popupManager.showPopup('MessagePopup', {message: e});
            this.scene.interactiveChildren = false;
            this.removeEventListeners();
        }
    }

    showSessionExpiredPopup() {
        this.popupManager.showPopup('SessionExpired', {onClick: this.reload.bind(this)});
    }

    async reload() {
        this.popupManager.hidePopup('SessionExpired');
        this.removeEventListeners();
        await this.logic.initSession(this.getUserData());
        this.scene.destroy();
        this.scene = new GamePlayScene(this.app);
        this.app.stage.addChild(this.scene);
        this.start();
    }

    reset() {
        this.scene.reset();
    }

    getInfo() {
        return this.server.getInfo();
    }
}

export const game = new Game();

window.game = game;
