import {TasksCard} from "./TaskCard.js";
import {TaskStatus} from "../../../../../shared/TaskStatus.js";

export class BasicTaskCard extends TasksCard {
    createContent(task) {
        switch (task.status) {
            case TaskStatus.IN_PROGRESS:
                this.subscribeButton = this.content.create.object('SubscribeButton', {x: 26, y: 206 - 46});
                this.subscribeButton.button.onPress.connect(this.onClickSubscribe.bind(this));
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

    onClickSubscribe() {
        this.onClickShare({
            task: this.task
        });
    }
}
