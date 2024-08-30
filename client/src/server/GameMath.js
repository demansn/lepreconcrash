import {GameRound} from "./GameRound";

export class GameMath {
    constructor(steps) {
        this.steps = steps;
        this.totalStepsNumber = this.steps.length;

        this.testRandomBonusStep();
    }

    getRandomGameRound(bet) {
        const bonusStep = this.getRandomBonusStep();
        const bonus = this.steps[bonusStep];

        return new GameRound({
            maxSteps: this.totalStepsNumber,
            loseStep: Math.floor(Math.random() * this.totalStepsNumber),
            bonus: {
                step: bonusStep,
                multiplier: bonus.bonusMultiplier,
                win: bet * bonus.bonusMultiplier,
            },
            betAmount: bet,
            steps: this.steps,
        })
    }

     getRandomBonusStep() {
        // Calculate the total probability
        const totalProbability = this.steps.reduce((acc, step) => acc + step.qualityBonus, 0);

        // Generate a random number in the range [0, totalProbability)
        const randomNumber = Math.random() * totalProbability;

        // Find the corresponding step
        let cumulativeProbability = 0;
        for (const step of this.steps) {
            cumulativeProbability += step.qualityBonus;
            if (randomNumber < cumulativeProbability) {
                return step.number;
            }
        }

        // Fallback in case of floating point precision issues
        return this.steps[this.steps.length - 1].number;
    }

    testRandomBonusStep(runs = 1000000) {
        const stepCounts = Array(this.steps.length).fill(0);

        // Run the test many times
        for (let i = 0; i < runs; i++) {
            const stepNumber = this.getRandomBonusStep();
            const stepIndex = stepNumber - 1; // Convert step number to index
            stepCounts[stepIndex]++;
        }

        // Calculate the expected probability for each step
        const totalProbability = this.steps.reduce((acc, step) => acc + step.qualityBonus, 0);

        console.log("Step | Actual % | Expected %");
        console.log("----------------------------");

        // Display the results
        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            const actualPercentage = (stepCounts[i] / runs) * 100;
            const expectedPercentage = (step.qualityBonus / totalProbability) * 100;
            console.log(
                `${step.number}    | ${actualPercentage.toFixed(2)}%    | ${expectedPercentage.toFixed(2)}%`
            );
        }
    }
}
