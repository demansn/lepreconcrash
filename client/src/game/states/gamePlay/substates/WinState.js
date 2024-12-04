import {GameBaseState} from "../../GameBaseState.js";

export class WinState extends GameBaseState {
    async enter() {
        const data = this.logic.getInfo();

        debugger
        this.scene.call('HeaderScene', 'animateTo', data);
        await this.scene.call('GamePlayScene', 'winRoundAnimation', data);


        this.owner.goTo('PlaceBetState');
    }
}
