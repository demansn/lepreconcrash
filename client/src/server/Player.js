import {toFixed} from "../game/utils";

export class Player {
    constructor(balance, luck) {
        this.balance = balance;
        this.luck = luck;
        this.level = 0;
    }

    addBalance(amount) {
        this.balance = toFixed(this.balance + amount);
    }

    subBalance(amount) {
        this.balance -= amount;
    }

    addLuck(amount) {
        this.luck += amount;
    }

    setLevel(level) {
        this.level = level;
    }

    getBalance() {
        return this.balance;
    }

    getLuck() {
        return this.luck;
    }

    getLevel() {
        return this.level;
    }
}
