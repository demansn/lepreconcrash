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
        this.scene.call('GamePlayScene', 'wait');
        await this.go();
    }

    async go() {
        try {
            this.scene.call('GamePlayScene', 'gotoWaitState');
            const roundResult = await this.logic.nextStep();
            const info = roundResult.isWin ? this.logic.getInfo() : null;

            const tween = this.playGoAnimation(roundResult, info);

            const {isLose, isBonus} = roundResult;

            if (!isLose && isBonus) {
                tween.then(() => this.owner.goTo('BonusGameState'));
            }
        } catch (e) {
            this.error(e);
        }
    }

    playGoAnimation(roundResult, info) {
        return this.owner.gamePlayScene.go(roundResult, info);
    }

    async onCashOut() {
        this.owner.goTo('CashOutState');
    }

    async onLose() {
       this.owner.goTo('LoseState');
    }

    async onWin() {
        this.owner.goTo('WinState');
    }
}
