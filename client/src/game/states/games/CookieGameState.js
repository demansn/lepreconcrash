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
        this.header.animateTo(this.gameLogic.player);
        await this.gamesScene.openCookie(message);

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
