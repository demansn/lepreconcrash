import {GameError} from "./GameError.js";

export class SessionExpiredError extends GameError {
    constructor() {
        super('Session expired', 'session-expired');
    }
}
