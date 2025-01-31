import {GameBaseState} from "./game/states/GameBaseState.js";
import {SlotGameScene} from "./game/scenes/slotgame/SlotGameScene.js";

export class SlotState extends GameBaseState {
    enter() {
        super.enter();

        this.scene.show('SlotGameScene');
        this.slotGameScene.on('spin', this.onSpin.bind(this));
    }

    async onSpin() {
        this.slotGameScene.setEnabled(false);

        const [prize, amount] = this.gameLogic.getBonusPrize();
        const resultSymbol = `${prize}-${amount}`;

        await this.slotGameScene.spin(resultSymbol);

        // show win popup

        this.slotGameScene.setEnabled(true);
    }
}
