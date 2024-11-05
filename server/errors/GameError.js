export class GameError extends Error {
    constructor(message, name) {
        super(message);
        this.name = name;
        this.gameError = true
    }
}
