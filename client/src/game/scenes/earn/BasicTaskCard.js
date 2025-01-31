import {TasksCard} from "./TaskCard.js";
import {TaskStatus} from "../../../../../shared/TaskStatus.js";
import {WatchButton} from "../../gameObjects/SubscribeButton.js";
import {TaskAction} from "../../../../../shared/TaskAction.js";

export class BasicTaskCard extends TasksCard {
    createContent(task) {
        switch (task.status) {
            case TaskStatus.IN_PROGRESS:
                if (task.actionRequired === TaskAction.WATCH_AD) {
                    this.watchButton = this.content.create.object('WatchButton', {x: 26, y: 206 - 46});
                    this.watchButton.button.onPress.connect(this.onClickWatchBtn.bind(this));
                } else {
                    this.subscribeButton = this.content.create.object('SubscribeButton', {x: 26, y: 206 - 46});
                    this.subscribeButton.button.onPress.connect(this.onClickSubscribe.bind(this));
                }
                break;
            case TaskStatus.NEED_CHECK:
                this.subscribeButton = this.content.create.object('SubscribeButton', {x: 26, y: 206 - 46});
                this.subscribeButton.button.onPress.connect(this.onClickSubscribe.bind(this));

                this.checkButton = this.content.create.object('CheckButtonButton', {x: 26, y: 300 - 46});
                this.checkButton.button.onPress.connect(this.onClickCheckBtn.bind(this));
                break;
            case TaskStatus.READY_TO_CLAIM:
                this.claimButton = this.content.create.object('ClaimButton', {x: 26, y: 206 - 46});
                this.claimButton.button.onPress.connect(() => {
                    this.onClickClaim(task.id, task);
                });
                break;
            case TaskStatus.CLAIMED:
                this.status = this.content.create.text({text: ``, style: 'TaskInfoText', y: this.info.y, x: 602, anchor: {x: 1}});
                this.status.text = 'CLAIMED';
                this.background.alpha = 0.5;
                this.info.alpha = 0.5;
                break;
        }
    }

    onClickCheckBtn() {
        this.onClickCheck({task: this.task});
    }

    onClickSubscribe() {
        this.onClickShare({
            task: this.task
        });
    }

    onClickWatchBtn() {
        this.onClickWatch({task: this.task});
    }
}
