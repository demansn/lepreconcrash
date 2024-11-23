import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ScrollBox} from "@pixi/ui";
import {BasicTaskCard, DailyTaskCard, FriendsTaskCard} from "./DailyTaskCard.js";

const TaskType = {
    daily: 'daily',
    basic: 'basic',
    friends: 'friends',
}

export class TasksPanel extends SuperContainer {
    constructor() {
        super();

        this.background = this.create.object('TaskPanelBackground');
        this.buttons =  this.create.object('TaskPanelButtons', {x: 's50%', y: 24});
        this.buttons.x -= (this.buttons.width / 2) +16;
        this.buttons.onChange.connect(this.onSelect.bind(this))

        this.panelsContainer = this.create.container();

        this.panels = [];
        this.panelsByTaskType = {};

        this.panelsByTaskType[TaskType.daily] = this.addTasksPanel();// 'daily'
        this.panelsByTaskType[TaskType.basic] = this.addTasksPanel();// 'basic'
        this.panelsByTaskType[TaskType.friends] = this.addTasksPanel();// 'friends'
        this.selectPanel(0);
    }

    addTasksToPanels(tasks) {
        for (const type in this.panelsByTaskType) {
            this.panelsByTaskType[type].addTasksCards(tasks.filter(task => task.type === type));
        }
    }

    addTasksPanel(tasks = [], height = 900) {
        const panel = this.panelsContainer.create.displayObject(TasksCardsPanel, {tasks, height});

        panel.x = 24;
        panel.y = this.buttons.x + this.buttons.height;
        panel.visible = false;

        this.panels.push(panel);

        return panel;
    }

    selectPanel(index) {
        this.panels.forEach((panel, i) => {
            panel.visible = i === index;
        });

        this.selectedPanelIndex = index;

        this.resize();
    }

    resize() {
        const height = Math.min(this.panels[this.selectedPanelIndex].height + 128);

        this.background.setSize({height, width: 678});
    }

    onSelect(i) {
        this.selectPanel(i);
    }
}

export class TasksCardsPanel extends SuperContainer {
    constructor({tasks, height = 900}) {
        super();

        this.list = this.addChild(new ScrollBox({
            elementsMargin: 16,
            leftPadding: 4,
            bottomPadding: 100,
            scroll: 'vertical',
            width: 632,
            height,
        }));

        tasks.forEach(task => this.list.addItem(this.createTaskCard(task)));
    }

    createTaskCard(task){
        const constucrorsByType = {
            [TaskType.daily]: DailyTaskCard,
            [TaskType.basic]: BasicTaskCard,
            [TaskType.friends]: FriendsTaskCard,
        }

        return this.create.displayObject(constucrorsByType[task.type], {task});
    }

    addTasksCards(tasks){
        tasks.forEach(task => {
            const card = this.createTaskCard(task);

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
