import {TaskType} from "../../../../../shared/TaskType.js";
import {FriendsTaskCard} from "./FriendsTaskCard.js";
import {BasicTaskCard} from "./BasicTaskCard.js";
import {CardsTabs} from "../../gameObjects/tabs/CardsTabs.js";
import {TasksCardsTab} from "./TasksCardsTab.js";

export class TasksTabs extends CardsTabs {
    constructor() {
        super({
            buttons: ['QUESTS', 'FRIENDS'],
            tabsByType: {[TaskType.basic]: [], [TaskType.friends]: []},
            CardsTabConstructor: TasksCardsTab
        });
    }

    addTasksCards(tasks) {
       super.addCards(this.toTasksByType(tasks));
    }

    toTasksByType(tasks) {
        const tasksByType = {};
        const constucrorsByType = {
            [TaskType.basic]: BasicTaskCard,
            [TaskType.friends]: FriendsTaskCard,
        }

        tasks.forEach(task => {
            if (!tasksByType[task.type]) {
                tasksByType[task.type] = [];
            }
            const taskData = {
                constructor: constucrorsByType[task.type],
                ...task
            };

            tasksByType[task.type].push(taskData);
        });

        return tasksByType;
    }

    updateTasksCards(tasks) {
        super.updateCards(this.toTasksByType(tasks));
    }

    getTabOptions() {
        return {
            onClickClaim: this.onClickClaim.bind(this),
            onClickShare: this.onClickShare.bind(this),
            onClickInvite: this.onClickInvite.bind(this),
            onClickCheck: this.onClickCheck.bind(this),
            onClickWatch: this.onClickWatch.bind(this)
        }
    }

    onClickClaim(taskId) {
        this.emit('onClickClaim', taskId);
    }

    onClickShare(taskId) {
        this.emit('onClickShare', taskId);
    }

    onClickInvite(taskId) {
        this.emit('onClickInvite', taskId);
    }

    onClickCheck(taskId) {
        this.emit('onClickCheck', taskId);
    }

    onClickWatch(taskId) {
        this.emit('onClickWatch', taskId);
    }
}
