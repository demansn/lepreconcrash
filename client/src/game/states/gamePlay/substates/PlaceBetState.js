import {GameBaseState} from "../../GameBaseState.js";

export class PlaceBetState extends GameBaseState {
    enter() {
        this.scene.call('GamePlayScene', 'updateHUD', {win: 0, multiplier: 0, luck: 0});
        this.scene.on('GamePlayScene', 'placeBet', this.onPlaceBet.bind(this));
        this.scene.call('GamePlayScene', 'waitPlaceBet');
    }

    exit() {
        this.scene.offAll('GamePlayScene', 'placeBet');
        this.scene.call('GamePlayScene', 'wait');
    }

    onPlaceBet() {
        this.placeBet();
    }

    async placeBet() {
        try {
            this.scene.call('GamePlayScene', 'wait');
            const {round} = await this.logic.placeBet();

            this.scene.call('HeaderScene', 'set', this.logic.getPlayerBalance());

            this.scene.call('GamePlayScene', 'play', {
                gameRound: round,
                info: this.logic.getInfo()
            });

            this.owner.goTo('PlayState');
        } catch (e) {
            this.error(e);
        }
    }
}
