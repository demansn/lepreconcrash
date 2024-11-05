import {GameError} from "./GameError.js";

export class ServerError extends GameError {
    constructor(message, name) {
        super(message, 'server-error');
    }
}
