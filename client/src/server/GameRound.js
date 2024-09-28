export class GameRound {
    constructor(result) {
        this.isEnded = false;
        this.currentStep = -1;
        this.result = result;
        this.endResutlt = null;
        this.bonusLuck = 0;
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
            this.bonusLuck = this.getBonusLuck();
        }

        if (this.isEndStep()) {
            this.endWithWin();
        } else if (this.isLoseStep()) {
            this.endWitLose();
        }
    }

    getCurrentWin() {
        return this.isFirstStep() ? this.result.betAmount : this.result.betAmount * this.getCurrentMultiplier();
    }

    getNextStepWin() {
        return (this.result.betAmount * this.getNextStepMultiplier()) - this.result.betAmount ;
    }

    getTotalWin() {
        return this.getCurrentWin();
    }

    getCurrentMultiplier() {
        return this.isFirstStep() ? 1 : this.result.steps[this.currentStep].multiplier;
    }

    getNextStepMultiplier() {
        return this.result.steps[this.currentStep + 1] ? this.result.steps[this.currentStep + 1].multiplier : 0;
    }

    getBonus() {
        return this.result.bonus;
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

    isFirstStep() {
        return this.currentStep === -1;
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
            bonus: this.getBonus(),
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
            step: this.currentStep,
            multiplier: this.getCurrentMultiplier(),
            totalWin: this.getTotalWin(),
            win: this.getCurrentWin(),
            bonus: this.getBonus(),
            isBonus: this.isBonusStep(),
            luck: this.getRoundLuck(),
        }
    }

    getInfo() {
        if (this.isEnded) {
            return this.endResutlt;
        }

        return {
            step: this.currentStep,
            multiplier: this.getCurrentMultiplier(),
            totalWin: this.getTotalWin(),
            win: this.getCurrentWin(),
            bonus: this.getBonus(),
            isBonus: this.isBonusStep(),
            luck: this.getRoundLuck(),
            nextStepWin: this.getNextStepWin(),
        };
    }

    getBonusLuck() {
           return this.result.bonus.luck;
    }

    getRoundLuck() {
        return this.currentStep + 1 + this.bonusLuck;
    }
}
