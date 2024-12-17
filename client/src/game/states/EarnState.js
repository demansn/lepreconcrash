import {ScreenState} from "./ScreenState.js";
import {TaskAction} from "../../../../shared/TaskAction.js";
import {nextMidnight, scheduleAtTime} from "../../../../shared/utils.js";
import {ShareInfoPopup} from "../popups/ShareInfoPopup.js";

export class EarnState extends ScreenState {
    async enter() {
        super.enter();

        this.init();
        this.timer = scheduleAtTime(() => this.loadTasks(), nextMidnight().toISOString());
    }

    async exit() {
        super.exit();

        this.earn.off('onClickClaim');
        this.earn.off('onClickInvite');

        clearTimeout(this.timer);
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
        this.header.set(this.logic.getPlayerBalance());
        this.earn.updateTasks([result.task]);

        this.footer.enable();
        this.earn.enable();
    }

    async loadTasks() {
        this.earn.showTasks(this.logic.player.tasks);
        const tasks = await this.logic.getTasks();
        this.earn.updateTasks(tasks);
    }

    inviteFriend(taskId) {
        this.logic.inviteFriend();
    }

    async onClickShare({task}) {
        const placeholders = {
            [TaskAction.SHARE_EMAIL]: 'Enter your email:',
            [TaskAction.SHARE_PHONE]: 'Enter your phone number:',
            [TaskAction.SHARE_X_ACCOUNT]: 'Enter your x account:',
        };
        const placeholder = placeholders[task.actionRequired];
        const title = task.description;
        const value = await this.showPopup(title, placeholder);

        if (value) {
            const updatedTasks = await this.logic.applyTaskAction(task, value);

            if (updatedTasks) {
                this.earn.updateTasks(updatedTasks);
            }
        }
    }

    showPopup(title, placeholder) {
        return ShareInfoPopup.show({title, placeholder});
    }
}
