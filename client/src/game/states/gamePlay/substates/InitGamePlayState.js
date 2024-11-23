import {GameBaseState} from "../../GameBaseState.js";

export class InitGamePlayState extends GameBaseState {
    enter() {
        this.scene.show('GamePlayScene', {
            app: this.PixiApplication.getApp(),
            gameRound: this.logic.gameRound,
            info: this.logic.getInfo()
        });

        if (this.logic.gameRound) {
            this.owner.goTo("PlayState");
        } else {
            this.owner.goTo('PlaceBetState');
        }
    }
}
