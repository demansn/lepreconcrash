import {getPlayerRankLevel} from "../../shared/PlayrLevels.js";
import {MersenneTwister19937, real} from "random-js";

export class GameMath {
    constructor(steps, prizes) {
        this.steps = steps;
        this.totalStepsNumber = this.steps.length - 1;
        this.prizeProbabilities = this.#normalizeProbabilities(prizes);
        this.probabilitiesToLose = this.getProbablityToLose(this.steps.length, 1);
        this.engine = MersenneTwister19937.autoSeed();
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
     1
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
            lastStep: this.totalStepsNumber,
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
        const rand = Math.random() ;
        let cumulative = 0;
        const totalLossProb = this.probabilitiesToLose.reduce((sum, p) => sum + p, 0);

        for (let i = 0; i < this.probabilitiesToLose.length; i++) {
            cumulative += this.probabilitiesToLose[i];
            if (rand < cumulative / totalLossProb) {
                return i + 1;
            }
        }

         return this.totalStepsNumber;
    }

    getProbablityToLose(steps, traps) {
        const probs = [];
        let prev = 0;

        for (let i = 0; i < steps; i++) {
            const p = traps / (steps - (i + 1) + traps + 1);
            const o = i === 0 ? 1 : probs[i - 1];
            const l = o * (1 - p);
            prev = l;
            probs.push(l);
        }

        return probs;
    }

     getRandomBonusStep() {
        return Math.floor(Math.random() * (this.totalStepsNumber - 2)) + 1;
    }

    getLuckLevel(luck) {
        return getPlayerRankLevel(luck);
    }

    getPrize() {
        const symbol = this.getRandomPrize();
        const [prize, amount] = symbol.split('-');

        return {prize, amount: Number(amount), symbol};
    }
}
