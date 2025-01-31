import Big from "big.js";
import {PrizeType} from "../../shared/PrizeType.js";

export class GameRound {
    constructor({result, currentStep = 0}) {
        this.result = result;
        this.currentStep = currentStep;
        this.isEnded = false;
        this.endResutlt = null;
        this.bonusPrize = null;
    }

    nextStep() {
        if (this.isEnded) {
            throw new Error('Round is ended')
        }

        this.currentStep++;

        if (this.currentStep > this.result.maxSteps) {
            throw new Error('Round is ended');
        }

        if (this.isBonusStep()) {
            this.bonusPrize = this.getBonusPrize();
        }

        if (this.isEndStep()) {
            this.endWithWin();
        } else if (this.isLoseStep()) {
            this.endWitLose();
        }
    }

    #getCurrentWin() {
        return Big(this.result.betAmount).mul(this.#getCurrentMultiplier()).plus(this.getBonusGold()).toNumber();
    }

    #getNextStepWin() {
        return Big(this.result.betAmount).mul(this.#getNextStepMultiplier()).minus(this.result.betAmount).toNumber();
    }

    #getNextStepMultiplier() {
        return this.#getStepMultiplier(this.currentStep + 1) || 0;
    }

    #getCurrentMultiplier() {
        return this.#getStepMultiplier(this.currentStep);
    }

    #getStepMultiplier(step) {
        return this.result.steps[step];
    }

    isFirstStep() {
        return this.currentStep === 1;
    }

    isEndStep() {
        return this.currentStep === this.result.lastStep;
    }

    isLoseStep() {
        return this.currentStep === this.result.loseStep;
    }

    isBonusStep() {
        return this.currentStep === this.result.bonus.step;
    }

    isEnd() {
        return this.isEnded;
    }

    isWin() {
        return this.endResutlt.isWin;
    }

    end() {
        this.endWithWin();
    }

    endWitLose() {
        if (this.isEnded) {
            return;
        }

        this.isEnded = true;
        this.endResutlt = {
            isLose: true,
            bonus: this.result.bonus,
            step: this.currentStep
        };
    }

    endWithWin() {
        if (this.isEnded) {
            return;
        }

        this.isEnded = true;
        this.endResutlt = {
            isWin: true,
            ...this.#getRoundData()
        }
    }

    getInfo() {
        if (this.isEnded) {
            return this.endResutlt;
        }

        return {
            ...this.#getRoundData(),
            nextStepWin: this.#getNextStepWin(),
        };
    }

    #getRoundData() {
        return {
            step: this.currentStep,
            multiplier: this.#getCurrentMultiplier(),
            totalWin: this.#getCurrentWin(),
            win: this.#getCurrentWin(),
            bonus:this.result.bonus,
            isBonus: this.isBonusStep(),
            isBonusCollected: this.result.bonus.step <= this.currentStep,
            luck: this.getRoundLuck(),
            stars: this.getBonusStars(),
            bet: this.result.betAmount
        };
    }

    getBonusPrize() {
           const [prize, amount] = this.result.bonus.prize.split('-');

           return {prize, amount: Number(amount)};
    }

    getBonusLuck() {
        if (this.isBonusCollected()) {
            const {prize, amount} = this.getBonusPrize();

            if (prize === PrizeType.LUCK) {
                return amount;
            }
        }

        return 0;
    }

    getBonusStars() {
        if (this.isBonusCollected()) {
            const {prize, amount} = this.getBonusPrize();

            if (prize === PrizeType.STAR) {
                return amount;
            }
        }

        return 0;
    }

    getBonusGold() {
        if (this.isBonusCollected()) {
            const {prize, amount} = this.getBonusPrize();

            if (prize === PrizeType.GOLD) {
                return amount;
            }
        }

        return 0;
    }

    isBonusCollected() {
        return this.result.bonus.step <= this.currentStep;
    }

    getRoundLuck() {
        return this.currentStep + this.getBonusLuck();
    }

    toObject() {
        return {
            currentStep: this.currentStep,
            result: this.result
        };
    }
}
