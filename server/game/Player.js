import Big from "big.js";
import {TaskStatus} from "../../shared/TaskStatus.js";
import {Task} from "./tasks/Task.js";

export class Player {
    #balance;
    #luck;
    #level;

    constructor({balance, luck, level, id, session, tasks = []}) {
        this.balance = balance;
        this.luck = luck;
        this.level = level;
        this.id = id;
        this.session = session;
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

    get level() {
        return this.#level;
    }

    set level(value) {
        this.#level = value;
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

    updateTaskOnAction(action) {
        return this.tasks.map(task => task.updateOnAction(action)).filter(Boolean);
    }

    toObject() {
        return {
            id: this.id,
            balance: this.balance,
            luck: this.luck,
            level: this.level,
            session: this.session,
            tasks: this.tasks.map(task => task.toObject())
        }
    }
}
