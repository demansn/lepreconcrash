import {ScreenState} from "./ScreenState.js";

export class EarnState extends ScreenState {
    async enter() {
        super.enter();

        this.init();
    }

    async exit() {
        super.exit();

        this.earn.off('onClickClaim');
        this.earn.off('onClickInvite');
    }

    async init() {
        await this.loadTasks();

        this.earn.on('onClickClaim', this.claimTaskReward.bind(this));
        this.earn.on('onClickInvite', this.inviteFriend.bind(this));
        this.earn.on('onClickShare', this.onClickShare.bind(this));
    }

    async claimTaskReward(taskId) {
        this.footer.disable();
        this.earn.disable();

        const result = await this.logic.claimTaskReward(taskId);

        this.scene.show('RewardDailyScene', result.task);
        this.header.setBalance(result.player.balance);
        this.earn.updateTasks([result.task]);

        this.footer.enable();
        this.earn.enable();
    }

    async loadTasks() {
        const tasks = await this.logic.getTasks();

        this.earn.showTasks(tasks);
    }

    inviteFriend(taskId) {
        this.logic.inviteFriend();
    }

    async onClickShare({value, task}) {
        await this.logic.applyTaskAction(task, value);
    }
}
