import Big from "big.js";
import {Task} from "./tasks/Task.js";
import {TaskAction} from "../../shared/TaskAction.js";

export class Player {
    #balance;
    #luck;
    level = 0;

    constructor({balance, luck, level, id, session, tasks = [], profile, gameCounter = {total: 0, wins: 0, loses: 0}}, tasksData) {
        this.balance = balance;
        this.luck = luck;
        this.level = level;
        this.id = id;
        this.session = session;
        this.profile = profile;
        this.gameCounter = gameCounter || {total: 0, wins: 0, loses: 0};
        this.tasks = tasks.map((data) => {
            const metaData = tasksData.find(task => task.id === data.id) || {};

            return new Task(data, metaData);
        });
    }

    addBalance(amount) {
        this.#balance = this.#balance.plus(amount);
    }

    subBalance(amount) {
        this.#balance = this.#balance.minus(amount);
    }

    addLuck(amount) {
        this.#luck = this.#luck.plus(amount);
    }

    get balance() {
        return this.#balance.toNumber();
    }

    set balance(value) {
        this.#balance = Big(value);
    }

    get luck() {
        return this.#luck.toNumber();
    }

    set luck(value) {
        this.#luck = Big(value);
    }

    addGame(isWin) {
        this.gameCounter.total++;
        if (isWin) {
            this.gameCounter.wins++;
        } else {
            this.gameCounter.loses++;
        }
    }

    /**
     * Возвращает задания игрока, включая статус и прогресс.
     * @returns {Array} Список заданий игрока.
     */
    getTasks() {
        return this.tasks.map(task => ({ ...task.data}));
    }

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }

    updateTaskOnAction(action) {
        return this.tasks.map(task => task.updateOnAction(action)).filter(Boolean);
    }

    updateTaskStatus(id, status) {
        const task = this.getTask(id);

        task.updateStatus(status);

        return task;
    }

    toSaveObject() {
        return {
            balance: this.balance,
            luck: this.luck,
            level: this.level,
            session: this.session,
            profile: this.profile,
            tasks: this.tasks.map(task => task.data),
            gameCounter: this.gameCounter,
        }
    }

    toClient() {
        return {
            id: this.id,
            balance: this.balance,
            luck: this.luck,
            level: this.level,
            session: this.session,
            profile: this.profile,
            tasks: this.tasks.map(task => task.toClient()),
            gameCounter: this.gameCounter
        }
    }
}
