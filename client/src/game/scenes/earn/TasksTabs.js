import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {TaskType} from "../../../../../shared/TaskType.js";
import {TasksCardsTab} from "./TasksCardsTab.js";

export class TasksTabs extends SuperContainer {
    constructor() {
        super();

        this.background = this.create.object('TaskPanelBackground');
        this.buttons =  this.create.object('TaskPanelButtons', {x: 's50%', y: 24});
        this.buttons.x -= (this.buttons.width / 2) +16;
        this.buttons.onChange.connect(this.onSelect.bind(this))

        this.tabs = this.create.container();
        this.tabsByTaskType = {};
        this.tabsByTaskType[TaskType.daily] = this.addTasksTab();// 'daily'
        this.tabsByTaskType[TaskType.basic] = this.addTasksTab();// 'basic'
        this.tabsByTaskType[TaskType.friends] = this.addTasksTab();// 'friends'
        this.selectTab(0);
        this.isCreatedTasks = false;
        this.selectedTabIndex = 0;
    }

    addTasksCards(tasks) {
        for (const type in this.tabsByTaskType) {
            this.tabsByTaskType[type].addTasksCards(tasks.filter(task => task.type === type));
        }
        this.isCreatedTasks = true;
        this.resize();
    }

    updateTasksCards(tasks) {
        for (const type in this.tabsByTaskType) {
            this.tabsByTaskType[type].updateTasksCards(tasks.filter(task => task.type === type));
        }
        this.resize();
    }

    addTasksTab(tasks = [], height = 900) {
        const panel = this.tabs.create.displayObject(TasksCardsTab, {tasks, height, onClickClaim: this.onClickClaim.bind(this), onClickShare: this.onClickShare.bind(this), onClickInvite: this.onClickInvite.bind(this)});

        panel.x = 24;
        panel.y = this.buttons.x + this.buttons.height;
        panel.visible = false;

        return panel;
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

    selectTab(index) {
        this.tabs.children.forEach((panel, i) => {
            panel.visible = i === index;
        });

        this.selectedTabIndex = index;

        this.resize();
    }

    resize() {
        const height = Math.min(this.tabs.children[this.selectedTabIndex].height + 138);

        this.background.setSize({height, width: 678});
    }

    onSelect(i) {
        this.selectTab(i);
    }
}
