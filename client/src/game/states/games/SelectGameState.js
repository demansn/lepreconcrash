import {GameBaseState} from "../GameBaseState.js";

export class SelectGameState extends GameBaseState {
    constructor(params) {
        super(params);

        this.gamesScene = this.scene.getScene('GamesScene');
    }
    enter() {
        super.enter();
        this.gamesScene.on('playGame', this.onPlayGame, this);
    }

    exit() {
        super.exit();
        this.gamesScene.off('playGame');
    }

    onPlayGame({game}) {
        if (game === 'cookie') {
            this.owner.goTo('CookieGameState');
        } else if (game === 'slot') {
            this.owner.goTo('SlotGameState');
        }
    }
}
