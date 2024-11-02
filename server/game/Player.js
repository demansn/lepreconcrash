export class Player {
    constructor({id, balance, luck, level, session}) {
        this.id = id;
        this.balance = balance;
        this.luck = luck;
        this.level = level;
        this.session = session;
    }

    addBalance(amount) {
        this.balance = this.balance + amount;
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

    toObject() {
        return {
            id: this.id,
            balance: this.balance,
            luck: this.luck,
            level: this.level
        };
    }
}
