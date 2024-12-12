import Big from "big.js";
import {Task} from "./tasks/Task.js";
import {TaskAction} from "../../shared/TaskAction.js";

export class Player {
    #balance;
    #luck;
    level = 0;

    constructor({balance, luck, level, id, session, tasks = [], profile}) {
        this.balance = balance;
        this.luck = luck;
        this.level = level;
        this.id = id;
        this.session = session;
        this.profile = profile;
        this.tasks = tasks.map(data => new Task(data));
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

    /**
     * Возвращает задания игрока, включая статус и прогресс.
     * @returns {Array} Список заданий игрока.
     */
    getTasks() {
        return this.tasks.map(task => ({
            ...task.toObject()
        }));
    }

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }

    updateTaskOnAction(action, value) {
        const updatedTasks = this.tasks.map(task => task.updateOnAction(action)).filter(Boolean);

        if (updatedTasks.length && value) {
            if (action === TaskAction.SHARE_EMAIL) {
                this.profile.email = value;
            }
            if (action === TaskAction.SHARE_X_ACCOUNT) {
                this.profile.xAccaunt = value;
            }
            if (action === TaskAction.SHARE_PHONE) {
                this.profile.phone = value;
            }
        }

        return updatedTasks;
    }

    toObject() {
        return {
            id: this.id,
            balance: this.balance,
            luck: this.luck,
            level: this.level,
            session: this.session,
            profile: this.profile,
            tasks: this.tasks.map(task => task.toObject())
        }
    }
}
