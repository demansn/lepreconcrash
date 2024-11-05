import Big from "big.js";

export class Player {
    #balance;
    #luck;
    #level;

    constructor({balance, luck, level, id, session}) {
        this.balance = balance;
        this.luck = luck;
        this.level = level;
        this.id = id;
        this.session = session;
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

    toObject() {
        return {
            balance: this.balance,
            luck: this.luck,
            level: this.level
        }
    }
}
