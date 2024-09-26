import {Player} from "./Player";
import {GameMath} from "./GameMath";
import {STEPS} from "./GameSteps";

export class GameServer {
    constructor() {
        this.math = new GameMath(STEPS);
        this.gameRound = null;
        this.player = new Player(1000, 0);
    }

    placeBet(amount) {
        if (this.gameRound && !this.gameRound.isEnd()) {
            throw new Error('Current round is not completed!');
        }

        this.player.subBalance(amount);
        this.gameRound = this.math.getRandomGameRound(amount);

        return this.gameRound.getInfo();
    }

    cashOut() {
        if (!this.gameRound) {
            throw new Error('Not placed bet!');
        }

        if (this.gameRound && this.gameRound.isEnd()) {
            throw new Error('Current round is completed!');
        }

        this.gameRound.end();

        const result = this.gameRound.getInfo();

        this.player.addBalance(result.totalWin);
        this.player.addLuck(result.luck);
        this.player.setLevel(this.math.getLuckLevel(this.player.getLuck()));

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

       const roundResult = this.gameRound.getInfo();

        if (this.gameRound.isEnd()) {
            if (this.gameRound.isWin()) {
                this.player.addBalance(this.gameRound.getTotalWin());
                this.player.addLuck(this.gameRound.getRoundLuck());
            }

            this.gameRound = null
        }

        return roundResult;
    }

    getInfo() {
        return {
            balance: this.player.getBalance(),
            luck: this.player.getLuck(),
            round: this.gameRound ? this.gameRound.getInfo() : {win: 0, luck: 0, multiplier: 0, nextStepWin: 0},
            level: this.player.getLevel()
        }
    }
}
