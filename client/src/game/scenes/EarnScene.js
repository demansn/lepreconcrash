import {ScreenScene} from "./ScreenScene.js";
import {TasksTabs} from "./earn/TasksTabs.js";


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

    showTasks(tasks) {
        if (this.tasksTabs.isCreatedTasks) {
            this.tasksTabs.updateTasksCards(tasks);
        } else {
            this.tasksTabs.addTasksCards(tasks);
        }
    }

    updateTasks(tasks) {
        this.tasksTabs.updateTasksCards(tasks);
    }
}
