export class Player {
    constructor(balance, luck) {
        this.balance = balance;
        this.luck = luck;
    }

    addBalance(amount) {
        this.balance += amount;
    }

    subBalance(amount) {
        this.balance -= amount;
    }

    addLuck(amount) {
        this.luck += amount;
    }

    getBalance() {
        return this.balance;
    }

    getLuck() {
        return this.luck;
    }
}
