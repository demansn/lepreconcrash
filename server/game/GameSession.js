import crypto from 'node:crypto';
import {GameRound} from "./GameRound.js";

export class GameSession {
    static generateSessionID() {
        return crypto.randomBytes(16).toString('hex');
    }

    constructor(properties) {
        const {
            playerID,
            onExpire = () => {},
            gameRound = null,
            id = GameSession.generateSessionID()
        } = properties;

        this.playerID = playerID;
        this.onExpire = onExpire;
        this.id = id;
        this.timeoutTime = 1000 * 60 * 5;
        this.timeout = null;

        this.gameRound = gameRound ? new GameRound(gameRound) : null;
    }

    startGameRound(gameRound) {
        if (this.gameRound) {
            throw new Error('Game round already started!');
        }

        this.gameRound = new GameRound(gameRound);

        this.updateTimeout();
    }

    finishGameRound() {
        this.updateTimeout();

        if (!this.gameRound) {
            throw new Error('Not placed bet!');
        }

        if (this.gameRound && !this.gameRound.isEnd()) {
            this.gameRound.end();

            const result = this.gameRound.getInfo();

            this.gameRound = null;

            return result;
        }
    }

    nextStep() {
        this.updateTimeout();

        if (!this.gameRound) {
            throw new Error('Not placed bet!');
        }

        if (this.gameRound && this.gameRound.isEnd()) {
            throw new Error('Current round is completed!');
        }

        this.gameRound.nextStep();

        const info = this.gameRound.getInfo();

        if (this.gameRound.isEnd()) {
            this.gameRound = null;
        }

        return info;
    }

    getGameRoundInfo() {
        this.updateTimeout();

        if (!this.gameRound) {
            return null;
        }

        return this.gameRound.getInfo();
    }

    hasGameRound() {
        return !!this.gameRound;
    }

    startTimeout() {
        this.timeout = setTimeout(() => {
            this.onExpire(this.id);
        }, this.timeoutTime);
    }

    clearTimeout() {
        clearTimeout(this.timeout);
    }

    updateTimeout() {
        this.clearTimeout();
        this.startTimeout();
    }

    isNotCompleted() {
        return this.gameRound && !this.gameRound.isEnd();
    }

    toObject() {
        return {
            id: this.id,
            gameRound: this.gameRound ? this.gameRound.toObject() : null
        };
    }
}
