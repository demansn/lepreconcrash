import {TaskStatus} from "../../../shared/TaskStatus.js";
import {TaskType} from "../../../shared/TaskType.js";

export class Task {
    constructor(data) {
        this.data = data;
        this.id = data.id;
    }

    isDaily() {
        return this.data.type === TaskType.daily;
    }

    resetProgress() {
        this.data.progress = 0;
        this.data.status = TaskStatus.IN_PROGRESS;
        this.data.updatedAt = new Date().toISOString();
    }

    /**
     * Update task progress on action.
     * @param {TaskAction} action - task action
     * @returns {Task}
     */
    updateOnAction(action) {
        if (this.data.actionRequired === action && (this.data.status === TaskStatus.IN_PROGRESS || this.isRepeatable())) {
            this.data.progress += 1;

            if (this.data.progress >= this.data.goal) {
                this.data.status = TaskStatus.READY_TO_CLAIM;
            }

            this.data.updatedAt = new Date().toISOString();

            return this;
        }
    }

    isReadyToClaim() {
        return this.data.status === TaskStatus.READY_TO_CLAIM;
    }

    isRepeatable() {
        return this.data.repeatable;
    }

    claimReward() {
        if (!this.isReadyToClaim()) {
            return 0;
        }

        const amount = this.data.progress / this.data.goal;
        const reward = amount * this.data.reward;

        this.data.counted += this.data.progress;

        if (this.isRepeatable()) {
            this.resetProgress();
        } else {
            this.data.status = TaskStatus.CLAIMED;
            this.data.completedAt = new Date().toISOString();
        }

        return reward;
    }

    toObject() {
        return this.data;
    }
}
