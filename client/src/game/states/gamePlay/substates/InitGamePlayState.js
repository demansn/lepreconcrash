import {GameBaseState} from "../../GameBaseState.js";

export class InitGamePlayState extends GameBaseState {
    enter() {
        this.scene.call('GamePlayScene', 'init', {
            app: this.PixiApplication.getApp(),
            gameRound: this.logic.gameRound,
            info: this.logic.getInfo()
        });

        if (this.logic.gameRound) {
            if (this.logic.isBonusStep() && this.logic.gameRound.bonus.prize) {
                this.owner.goTo('BonusGameState', true);
            } else {
                this.owner.goTo("PlayState");
            }
        } else {
            this.owner.goTo('PlaceBetState');
        }
    }
}
