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
        this.earn.off('onClickShare');
        this.earn.off('onClickCheck');
        this.earn.off('onClickWatch');

        clearTimeout(this.timer);
    }

    async init() {
        await this.loadTasks();

        this.earn.on('onClickClaim', this.claimTaskReward.bind(this));
        this.earn.on('onClickInvite', this.inviteFriend.bind(this));
        this.earn.on('onClickShare', this.onClickShare.bind(this));
        this.earn.on('onClickCheck', this.onClickCheck.bind(this));
        this.earn.on('onClickWatch', this.onClickWatch.bind(this));
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
        let tasks = await this.logic.getTasks();
        this.earn.updateTasks(tasks);
    }

    inviteFriend(taskId) {
        this.logic.inviteFriend();
    }

    async onClickShare({task}) {
        if (task) {
            const updatedTasks = await this.logic.applyTaskAction(task);

            if (updatedTasks) {
                this.earn.updateTasks(updatedTasks);
            }
        }
    }

    async onClickCheck({task}) {
        if (task) {
            const updatedTasks = await this.logic.checkTask(task);

            if (updatedTasks) {
                this.earn.updateTasks(updatedTasks);
            }
        }
    }

    async onClickWatch({task}) {
        this.analytics.track('AdsView', {});
       const result = await this.ads.show();

       if (result) {
           const updatedTasks = await this.logic.watchAdsTask(task);

           if (updatedTasks) {
               this.earn.updateTasks(updatedTasks);
           }
       }
    }
}
