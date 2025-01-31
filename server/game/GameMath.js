import {getPlayerRankLevel} from "../../shared/PlayrLevels.js";

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

        if (ts !== undefined) {
            this.totalStepsNumber = ts;
        }

        const result = {
            maxSteps: this.totalStepsNumber,
            lastStep: this.totalStepsNumber - 1,
            loseStep,
            bonus: {
                step: bonusStep,
                prize: this.getRandomPrize(),
            },
            betAmount: bet,
            steps: this.steps.map(step => step.multiplier),
        };

        return this.createGameRound({result});
    }

    getRandomLoseStep() {
        return Math.floor(Math.random() * this.totalStepsNumber);
    }

     getRandomBonusStep() {
        const totalProbability = this.steps.reduce((acc, step) => acc + step.qualityBonus, 0);
        const randomNumber = Math.random() * totalProbability;

        let cumulativeProbability = 0;
        for (const step of this.steps) {
            cumulativeProbability += step.qualityBonus;
            if (randomNumber < cumulativeProbability) {
                return step.number;
            }
        }

        return this.steps[this.steps.length - 1].number;
    }

    getLuckLevel(luck) {
        return getPlayerRankLevel(luck);
    }

    getPrize() {
        const [prize, amount] = this.getRandomPrize().split('-');

        return {prize, amount: Number(amount)};
    }
}
