import {ScreenScene} from "./ScreenScene.js";
import {TasksPanel} from "./earn/TasksPanel.js";


export class EarnScene extends ScreenScene {
    constructor() {
        super({name: 'earn'});

        this.tasksPanel = this.create.displayObject(TasksPanel, {
            x: 21,
            y: 128,
        })
    }

    showTasks(tasks) {
        this.tasksPanel.addTasksToPanels(tasks);
    }
}
