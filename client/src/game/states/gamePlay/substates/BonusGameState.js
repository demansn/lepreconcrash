import {GameBaseState} from "../../GameBaseState.js";

export class BonusGameState extends GameBaseState {
    async enter(fromInit) {
        super.enter();

        this.gamePlayScene = this.scene.getScene('GamePlayScene');

        this.gamePlayScene.on('spin', this.onSpin.bind(this));
         this.gamePlayScene.showSlotGame(fromInit);
    }

    async onSpin() {
        const result = await this.gameLogic.gameRound;

        this.gamePlayScene.showResultBonusGame(this.gameLogic.gameRound).then(() => {
            this.owner.goTo('PlayState')
        });
    }

    async exit() {
        super.exit();

        this.gamePlayScene.off('spin');
    }
}
