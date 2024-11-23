import {GameBaseState} from "../../GameBaseState.js";

export class LoseState extends GameBaseState {
    async enter() {
        await this.scene.call('GamePlayScene', 'reset');

        this.owner.goTo('PlaceBetState');
    }
}
