import {GameBaseState} from "../GameBaseState.js";

export class CookieGameState extends GameBaseState {
    constructor(params) {
        super(params);

        this.gamesScene = this.scene.getScene('GamesScene');
    }
    enter() {
        super.enter();
        this.gamesScene.showCookieGame();
        this.gamesScene.on('closeGame', this.onCloseGame, this);
    }

    onCloseGame() {
        this.owner.goTo('SelectGameState');
    }

    exit() {
        super.exit();
        this.gamesScene.hideCookieGame();
    }
}
