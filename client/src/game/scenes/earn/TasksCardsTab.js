import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ScrollBox} from "@pixi/ui";
import {DailyTaskCard} from "./DailyTaskCard.js";
import {BasicTaskCard} from "./BasicTaskCard.js";
import {FriendsTaskCard} from "./FriendsTaskCard.js";
import {TaskType} from "../../../../../shared/TaskType.js";

export class TasksCardsTab extends SuperContainer {
    constructor({tasks, height = 900, onClickClaim, onClickShare, onClickInvite}) {
        super();

        this.onClickClaim = onClickClaim;
        this.onClickShare = onClickShare;
        this.onClickInvite = onClickInvite;

        this.list = this.addChild(new ScrollBox({
            elementsMargin: 16,
            leftPadding: 4,
            bottomPadding: 100,
            scroll: 'vertical',
            width: 632,
            height,
        }));

        tasks.forEach(task => this.list.addItem(this.createTaskCard(task, {onClickClaim, onClickShare, onClickInvite})));
    }

    createTaskCard(task, params) {
        const constucrorsByType = {
            [TaskType.daily]: DailyTaskCard,
            [TaskType.basic]: BasicTaskCard,
            [TaskType.friends]: FriendsTaskCard,
        }

        return this.create.displayObject(constucrorsByType[task.type], {task, ...params});
    }

    updateTaskCard(task) {
        const card = this.list.visibleItems.find(card => card.task.id === task.id);

        if (!card) {
            return;
        }

        card.update(task);
    }

    updateTasksCards(tasks) {
        tasks.forEach(task => this.updateTaskCard(task));
        this.resize();
    }

    addTasksCards(tasks){
        tasks.forEach(task => {
            const card = this.createTaskCard(task, {onClickClaim: this.onClickClaim, onClickShare: this.onClickShare, onClickInvite: this.onClickInvite});

            card.on('changedSize', this.resize.bind(this));

            this.list.addItem(card);
        });
    }

    resize() {
        this.list.list.arrangeChildren();
        this.list.resize(true);
        this.list.scrollTop();
        this.emit('changedSize');
    }
}
