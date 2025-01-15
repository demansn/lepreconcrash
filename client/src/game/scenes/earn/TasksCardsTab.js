import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {List, ScrollBox} from "@pixi/ui";
import {DailyTaskCard} from "./DailyTaskCard.js";
import {BasicTaskCard} from "./BasicTaskCard.js";
import {FriendsTaskCard} from "./FriendsTaskCard.js";
import {TaskType} from "../../../../../shared/TaskType.js";

export class TasksCardsTab extends SuperContainer {
    constructor({tasks, height = 900, onClickClaim, onClickShare, onClickInvite, onClickCheck}) {
        super();

        this.onClickClaim = onClickClaim;
        this.onClickShare = onClickShare;
        this.onClickInvite = onClickInvite;
        this.onClickCheck = onClickCheck;

        this.list = this.addChild(new List({
            elementsMargin: 16,
            topPadding: 2,
            leftPadding: 4,
            rightPadding: 4,
        }));

        tasks.forEach(task => this.list.addChild(this.createTaskCard(task, {onClickClaim, onClickShare, onClickInvite, onClickCheck})));
    }

    createTaskCard(task, params) {
        const constucrorsByType = {
            [TaskType.daily]: DailyTaskCard,
            [TaskType.basic]: BasicTaskCard,
            [TaskType.friends]: FriendsTaskCard,
        }

        return this.create.displayObject(constucrorsByType[task.type], {task, ...params});
    }

    getHeight() {
        this.list.arrangeChildren();

        return this.list.height;
    }

    updateTaskCard(task) {
        const card = this.list.children.find(card => card.task.id === task.id);

        if (!card) {
            return;
        }

        card.update(task);
    }

    updateTasksCards(tasks) {
        tasks.forEach(task => this.updateTaskCard(task));
        window.setTimeout(() =>this.resize(), 1);
    }

    addTasksCards(tasks){
        tasks.forEach(task => {
            const card = this.createTaskCard(task, {onClickClaim: this.onClickClaim, onClickShare: this.onClickShare, onClickInvite: this.onClickInvite, onClickCheck: this.onClickCheck});

            card.on('changedSize', this.resize.bind(this));

            this.list.addChild(card);
        });

        this.resize();
    }

    resize() {
        this.emit('changedSize');
    }
}
