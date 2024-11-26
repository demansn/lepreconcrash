import {GamePlayScene} from "../../scenes/gamePlay/GamePlayScene.js";
import {StateWithFooter} from "../StateWithFooter.js";

export class GamePlayState extends StateWithFooter {

    enter() {
        super.enter();

        this.app = this.PixiApplication.getApp();

        if  (!this.currentState) {
            this.goTo('InitGamePlayState');
        }

        this.header.set(this.logic.getInfo());
        this.scene.show('GamePlayScene');
    }

    exit() {
        super.exit();

        this.scene.hide('GamePlayScene');
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
        }
    }

    showSessionExpiredPopup() {
        // this.popupManager.showPopup('SessionExpired', {onClick: this.reload.bind(this)});
    }

    async reload() {
        // this.popupManager.hidePopup('SessionExpired');
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
