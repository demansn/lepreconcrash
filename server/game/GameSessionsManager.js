import {GameSession} from "./PlayerSession.js";

export class GameSessionsManager {
    #playerSessions = new Map();
    #sessionIdMap = new Map();

    createSession(playerID) {
        const session = new GameSession(playerID);

        this.#playerSessions.set(session.id, session);
        this.#sessionIdMap.set(playerID ,session.id);

        return session.id;
    }

    has(id) {
        return this.#sessionIdMap.has(id) || this.#playerSessions.has(id);
    }

    get(id) {
        return this.#playerSessions.get(id) || this.#playerSessions.get(this.#sessionIdMap.get(id));
    }
}
