import {getPlayerRankLevel} from "../../shared/PlayrLevels.js";
import {GameSteps} from "./GameSteps.js";

export class GameMath {
    constructor(steps, prizes) {
        this.steps = steps;
        this.totalStepsNumber = this.steps.length;
        this.prizeProbabilities = this.#normalizeProbabilities(prizes);
    }

    #normalizeProbabilities(prizeProbabilities) {
        const total = Object.values(prizeProbabilities).reduce((sum, { probability }) => sum + probability, 0);
        return Object.fromEntries(
            Object.entries(prizeProbabilities).map(([prize, { probability }]) => [
                prize, (probability / total) * 100
            ])
        );
    }

    /**
     *
     * @returns {string}
     */
    getRandomPrize() {
        const rand = Math.random() * 100;
        let cumulativeProbability = 0;

        for (const [prize, probability] of Object.entries(this.prizeProbabilities)) {
            cumulativeProbability += probability;
            if (rand <= cumulativeProbability) return prize;
        }

        return Object.keys(this.prizeProbabilities)[0];
    }

    createGameRound(roundData) {
        return roundData;
    }

    getRandomGameRound(bet, {bonusStep: bs, loseStep: ls, winStep: ts} = {}) {
        const bonusStep = bs  !== undefined ? bs : this.getRandomBonusStep();
        const loseStep = ls !== undefined ? ls : this.getRandomLoseStep();
        const luck = this.steps[bonusStep].bonusLuck;
        const isWinBonusPrize = this.chance(0.3);

        if (ts !== undefined) {
            this.totalStepsNumber = ts;
        }

        const result = {
            maxSteps: this.totalStepsNumber,
            lastStep: this.totalStepsNumber - 1,
            loseStep,
            bonus: {
                step: bonusStep,
                luck,
                prize: isWinBonusPrize ? this.getRandomPrize() : undefined,
            },
            betAmount: bet,
            steps: this.steps.map(step => step.multiplier),
        };

        return this.createGameRound({result});
    }

    chance(percent = 0.3) {
        return Math.random() < percent;
    }

    getRandomLoseStep() {
        return this.getRandomLoseByMath();

        const rand = Math.random() ;
        let cumulative = 0;
        const totalLossProb = this.steps.reduce((sum, step) => sum + step.probabilityToLose, 0);

        for (let i = 0; i < this.steps.length; i++) {
            cumulative += this.steps[i].probabilityToLose;
            if (rand < cumulative / totalLossProb) {
                return i;
            }
        }

         return Math.floor(Math.random() * this.totalStepsNumber);
    }

    getRandomLoseByMath() {
            const lines = this.steps.length - 1;
            let l = this.steps.length - 1;
            let t = 2;
            let steps = 0;
            for (let i = 0; i < lines; i++) {
                if (Math.random() < t / (t + l)) {
                    return steps;
                }
                l = l - 1;
                steps = steps + 1;
            }
            return steps;
    }

     getRandomBonusStep() {
        return  Math.floor(Math.random() * (this.totalStepsNumber - 2)) + 1;
    }

    getLuckLevel(luck) {
        return getPlayerRankLevel(luck);
    }

    getPrize() {
        const [prize, amount] = this.getRandomPrize().split('-');

        return {prize, amount: Number(amount)};
    }
}
