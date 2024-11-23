import {GamePlayScene} from "../../scenes/gamePlay/GamePlayScene.js";
import {StateWithFooter} from "../StateWithFooter.js";
import {app} from "../../app.js";

export class GamePlayState extends StateWithFooter {

    enter() {
        super.enter();

        this.app = this.PixiApplication.getApp();

        if  (!this.currentState) {
            this.goTo('InitGamePlayState');
        }

        this.header.set(this.logic.getInfo());
        // this.scene.call('HeaderScene', 'set', this.logic.getInfo());
        this.init();
    }

    exit() {
        super.exit();

        this.scene.hide('GamePlayScene');
    }

    async init() {
        // window.Telegram.WebApp.openInvoice(link);
        // window.Telegram.WebApp.onEvent('invoiceClosed', (message) => {
        //     console.log('Message', message);
        // });


        // window.Telegram.WebApp.showAlert('Welcome to the game!', () => {
        //     console.log('Alert closed');
        // });

        this.gamePlayScene = this.scene.show('GamePlayScene', this.app);

        // this.start();
        // sound.play('mainMusic', {loop: true});
    }

    start() {
        this.gamePlayScene.updateHUD(this.logic.getInfo());

        if (this.logic.gameRound) {
            this.restoreGame();
        } else {
            this.startGame();
        }

        this.addEventListeners();
    }


    restoreGame() {

    }

    addEventListeners() {
        app.eventEmitter.on('hud:play:clicked', () => this.placeBet(10), this);
        app.eventEmitter.on('hud:cashOut:clicked', () => this.cashOut(), this);
        app.eventEmitter.on('hud:go:clicked', () => this.go(), this);

        // app.eventEmitter.on('popups:show', this.popupManager.showPopup, this.popupManager);
    }

    removeEventListeners() {
        app.eventEmitter.off('hud:play:clicked');
        app.eventEmitter.off('hud:cashOut:clicked');
        app.eventEmitter.off('hud:go:clicked');
        app.eventEmitter.off('popups:show');
    }



    async cashOut() {
        try {
            const {gameRound} = await this.logic.cashOut();

            this.gamePlayScene.cashOut(this.logic.getInfo(), gameRound).add(() => {
                this.gamePlayScene.reset();
            });
        } catch (e) {
            this.error(e);
        }
    }

    error(e) {
        if (e.name === 'session-expired') {
            this.showSessionExpiredPopup();
        } else {
            // this.popupManager.showPopup('MessagePopup', {message: e});
            this.gamePlayScene.interactiveChildren = false;
            this.removeEventListeners();
        }
    }

    showSessionExpiredPopup() {
        // this.popupManager.showPopup('SessionExpired', {onClick: this.reload.bind(this)});
    }

    async reload() {
        // this.popupManager.hidePopup('SessionExpired');
        this.removeEventListeners();
        await this.logic.initSession(this.getUserData());
        this.gamePlayScene.destroy();
        this.scene = new GamePlayScene(this.app);
        this.app.stage.addChild(this.scene);
        this.start();
    }

    reset() {
        this.gamePlayScene.reset();
    }

    getInfo() {
        return this.server.getInfo();
    }
}
