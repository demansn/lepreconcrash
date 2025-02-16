import {ScreenState} from "../ScreenState.js";

export class GamesState extends ScreenState {
    enter() {
        super.enter();


        if  (!this.currentState) {
            this.goTo('SelectGameState');
        }
    }

    exit() {
        super.exit();

    }
}
