import {GameBaseState} from "../../GameBaseState.js";

export class WinState extends GameBaseState {
    async enter() {
        const data = this.logic.getInfo();
        debugger
        await this.scene.call('GamePlayScene', 'winRoundAnimation');
        // this.winRoundAnimation(info, result);
    }
}
