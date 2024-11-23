import {GameBaseState} from "../../GameBaseState.js";

export class PlayState extends GameBaseState {
    enter() {
        this.scene.on('GamePlayScene', 'go', this.onGo.bind(this));
        this.scene.on('GamePlayScene', 'cashOut', this.onCashOut.bind(this));
        this.scene.on('GamePlayScene', 'lose', this.onLose.bind(this));
        this.scene.on('GamePlayScene', 'win', this.onWin.bind(this));
        this.scene.call('GamePlayScene', 'waitGo');
    }

    exit() {
        this.scene.offAll('GamePlayScene', ['go', 'cashOut', 'lose', 'win']);
    }

    async onGo() {
        await this.go();
    }

    async go() {
        try {
            const roundResult = await this.logic.nextStep();
            const info = roundResult.isWin ? this.logic.getInfo() : null;

            await this.scene.call('GamePlayScene', 'go', roundResult, info);
        } catch (e) {
            this.error(e);
        }
    }

    async onCashOut() {
        await this.owner.cashOut();
    }

    async onLose() {
       this.owner.goTo('LoseState');
    }

    async onWin() {
       console.log('Win');
    }
}
