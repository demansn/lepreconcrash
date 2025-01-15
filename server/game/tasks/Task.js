import {TaskStatus} from "../../../shared/TaskStatus.js";
import {TaskType} from "../../../shared/TaskType.js";

export class Task {
    constructor(data, metaData) {
        this.data = data;
        this.metaData = metaData;
        this.id = data.id;
    }

    isDaily() {
        return this.metaData.type === TaskType.daily;
    }

    isInProgress() {
        return this.data.status === TaskStatus.IN_PROGRESS;
    }

    isInNeedToCheck() {
        return this.data.status === TaskStatus.NEED_CHECK;
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
        const isStatusAllowed = this.isInNeedToCheck() || this.isInProgress();

        if (this.metaData.actionRequired === action && (isStatusAllowed || this.isRepeatable())) {
            this.data.progress += 1;

            if (this.data.progress >= this.metaData.goal) {
                this.data.status = TaskStatus.READY_TO_CLAIM;
            }

            this.data.updatedAt = new Date().toISOString();

            return this;
        }
    }

    /**
     * Update task status.
     * @param {TaskStatus} status - task status
     * @returns {Task}
     */
    updateStatus(status) {
        this.data.status = status;
        this.data.updatedAt = new Date().toISOString();

        return this;
    }

    isReadyToClaim() {
        return this.data.status === TaskStatus.READY_TO_CLAIM;
    }

    isRepeatable() {
        return this.metaData.repeatable;
    }

    claimReward() {
        if (!this.isReadyToClaim()) {
            return 0;
        }

        const amount = this.data.progress / this.metaData.goal;
        const reward = amount * this.metaData.reward;

        this.data.counted += this.data.progress;

        if (this.isRepeatable()) {
            this.resetProgress();
        } else {
            this.data.status = TaskStatus.CLAIMED;
            this.data.completedAt = new Date().toISOString();
        }

        return reward;
    }

    get actionRequired() {
        return this.metaData.actionRequired;
    }

    toClient() {
        return {...this.metaData, ...this.data};
    }

    toObject() {
        return this.data;
    }
}
