import crypto from 'node:crypto';

export class GameSession {
    static generateSessionID() {
        return crypto.randomBytes(16).toString('hex');
    }

    constructor(playerID) {
        this.playerID = playerID;
        this.id = GameSession.generateSessionID();
    }

    startGameRound(gameRound) {
        if (this.gameRound) {
            throw new Error('Game round already started!');
        }

        this.gameRound = gameRound;
    }

    finishGameRound() {
        if (!this.gameRound) {
            throw new Error('Not placed bet!');
        }

        if (this.gameRound && this.gameRound.isEnd()) {

        }

        !this.gameRound.isEnd() && this.gameRound.end();

        const result = this.gameRound.getInfo();

        this.gameRound = null;

        return result;
    }

    nextStep() {
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
        return this.gameRound.getInfo();
    }

    hasGameRound() {
        return !!this.gameRound;
    }
}
