import {ScreenState} from "./ScreenState.js";

export class EarnState extends ScreenState {
    async enter() {
        super.enter();

        this.loadTasks();
    }

    async loadTasks() {
        const tasks = await this.logic.getTasks();

        this.earn.showTasks(tasks);
        console.log(tasks);
    }
}
