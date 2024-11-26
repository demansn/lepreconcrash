import {TasksCard} from "./TaskCard.js";
import {TaskStatus} from "../../../../../shared/TaskStatus.js";

export class DailyTaskCard extends TasksCard {
    createContent(task) {
        const {goal, progress} = task;
        const left = goal - progress;

        this.status = this.content.create.text({text: ``, style: 'TaskInfoText', y: this.info.y, x: 602, anchor: {x: 1}});

        switch (task.status) {
            case TaskStatus.IN_PROGRESS:
                this.status.text = `${left} LEFT`;
                this.progressBar = this.content.create.object('ProgressBar', {
                    x: 26, y: 206 - 46,
                    parameters: {
                        bg: 'task_progress_bg',
                        fill: 'task_progress_fill',
                        fillPaddings: {top: 4, left: 4},
                        progress: progress / goal * 100,
                    }
                });
                break;
            case TaskStatus.READY_TO_CLAIM:
                this.status.text = '';
                this.claimButton = this.content.create.object('ClaimButton', {x: 26, y: 206 - 46});
                this.claimButton.button.onPress.connect(() => {
                    this.onClickClaim(task.id, task);
                });
                break;
            case TaskStatus.CLAIMED:
                this.status.text = 'CLAIMED';
                this.background.alpha = 0.5;
                this.info.alpha = 0.5;
                break;
        }
    }
}

