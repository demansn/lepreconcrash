import {GameSession} from "./GameSession.js";

export class GameSessionsManager {
    #dbAdapter;
    #playerSessions = new Map();
    #sessionIdMap = new Map();

    constructor(dbAdapter) {
        this.#dbAdapter = dbAdapter;
    }

    has(id) {
        return this.#sessionIdMap.has(id) || this.#playerSessions.has(id);
    }

    get(id) {
        return this.#playerSessions.get(id) || this.#sessionIdMap.get(id);
    }

    getSession(playerID, sessionData) {
        if (this.#sessionIdMap.has(playerID)) {
            return this.#sessionIdMap.get(playerID);
        }

        return this.#createAndAddSession(playerID, sessionData ? sessionData : {});
    }

    async saveAll() {
        for (const session of this.#playerSessions.values()) {
            await this.#saveSession(session);
        }
    }

    #createAndAddSession(playerID, {id, gameRound} = {}) {
        const session = new GameSession({id, playerID, onExpire: this.#sessionOnExpire.bind(this), gameRound});

        this.#playerSessions.set(session.id, session);
        this.#sessionIdMap.set(playerID, session);

        return session;
    }

    async #sessionOnExpire(sessionID) {
        const session = this.#playerSessions.get(sessionID);

        if (!session) {
            return;
        }

        await this.#saveSession(session);

        this.#playerSessions.delete(sessionID);
        this.#sessionIdMap.delete(session.playerID);
    }

    async #saveSession(session) {
        if (session.isNotCompleted()) {
            await this.#dbAdapter.updatePlayer(session.playerID, {session: session.toObject()});
        }
    }
}
