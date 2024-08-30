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

        if (this.gameRound && this.gameRound.isFirstStep()) {
            throw new Error('Вы не сделали ни одного шага!');
        }

        this.gameRound.end();

        const result = this.gameRound.getInfo();

        this.player.addLuck(result.step);
        this.player.addBalance(result.totalWin);
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
            }
            this.gameRound = null
        }

        return roundResult;
    }

    getInfo() {
        return {
            balance: this.player.getBalance(),
            luck: this.player.getLuck(),
            round: this.gameRound ? this.gameRound.getInfo() : null
        }
    }
}
