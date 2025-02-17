import {gsap} from "gsap";
import {GameBaseState} from "../GameBaseState.js";

export class CookieGameState extends GameBaseState {
    constructor(params) {
        super(params);

        this.gamesScene = this.scene.getScene('GamesScene');
        /**
         * @type {HeaderScene}
         */
        this.header = this.scene.getScene('HeaderScene');
    }

    enter() {
        super.enter();
        this.gamesScene.showCookieGame();
        this.gamesScene.on('closeGame', this.onCloseGame, this);
        this.gamesScene.on('openCookie', this.openCookie, this);
    }

    async openCookie() {
        this.gamesScene.disableUI();

        const resultPromise = this.gameLogic.openCookie();
        this.header.setBalance(this.gameLogic.getBalance());
        const message = await resultPromise;

        if (!message) {
            this.gamesScene.enableUI();
            return;
        }

        this.header.animateTo(this.gameLogic.player);

        this.gamesScene.cookieGame.on('close', this.closeCookie, this);

        this.openTween = gsap.timeline();
        this.openTween
            .add(this.gamesScene.openCookie(message))
            .add(() => this.closeCookie(), '+=9');
    }

    closeCookie() {
        if (this.openTween) {
            this.openTween.kill();
            this.openTween = null;
        }

        this.gamesScene.cookieGame.off('close');
        this.gamesScene.cookieGame.closeCookie();
        this.gamesScene.enableUI();
    }

    onCloseGame() {
        this.owner.goTo('SelectGameState');
    }

    exit() {
        super.exit();
        this.gamesScene.hideCookieGame();
        this.gamesScene.off('closeGame');
        this.gamesScene.off('openCookie');
    }
}
