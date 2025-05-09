import {ScreenScene} from "./ScreenScene.js";
import {TasksTabs} from "./earn/TasksTabs.js";
import {TaskAction} from "../../../../shared/TaskAction.js";

export class EarnScene extends ScreenScene {
    constructor() {
        super({name: 'earn'});

        this.tasksTabs = this.create.displayObject(TasksTabs, {
            x: 21,
            y: 128,
        });

        this.tasksTabs.on('onClickClaim', this.onClaimTaskReward.bind(this));
        this.tasksTabs.on('onClickShare', this.onShare.bind(this));
        this.tasksTabs.on('onClickInvite', this.onClaimInvite.bind(this));
        this.tasksTabs.on('onClickCheck', this.onClickCheck.bind(this));
        this.tasksTabs.on('onClickWatch', this.onClickWatch.bind(this));
    }

    onClaimTaskReward(taskId) {
        this.emit('onClickClaim', taskId);
    }

    onShare(e) {
        this.emit('onClickShare', e);
    }

    onClaimInvite(taskId) {
        this.emit('onClickInvite', taskId);
    }

    onClickCheck(taskId) {
        this.emit('onClickCheck', taskId);
    }

    onClickWatch(taskId) {
        this.emit('onClickWatch', taskId);
    }

    showTasks(tasks) {
        tasks.sort((a, b) => {
            if (a.actionRequired === TaskAction.WATCH_AD) {
                return -1;
            }

            return 0;
        });

        this.tasksTabs.setTabsData(tasks);
    }

    updateTasks(tasks) {
        this.tasksTabs.setTabsData(tasks);
    }
}
