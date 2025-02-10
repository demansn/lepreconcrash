import {GameMath} from "./GameMath.js";
import {GameSteps} from "./GameSteps.js";
import {SlotMachinePrizes} from "../configs/SlotMachinePrizes.js";

const math = new GameMath(GameSteps, SlotMachinePrizes);


// simulate 10000000 games to check if the probabilities are correct
const results = {
    steps: [],
    bets: 0,
    winRounds: 0
};

const total = 1_000_000;

for (let i = 0; i < total; i++) {
    const loseStep = math.getRandomLoseStep();
    results.bets += 1;
    if (loseStep === 25) {
        results.winRounds++;
    } else {
        results.steps[loseStep] = (results.steps[loseStep] || 0) + 1;
    }
}


results.steps.forEach((count, step) => {
    console.log(`Lose ${step}: %${(count / total * 100).toFixed(2)}=${count}  pl${math.probabilitiesToLose[step - 1]}`);
});
console.log(`Win rounds: %${(results.winRounds / total * 100).toFixed(2)}=${results.winRounds} pl${math.probabilitiesToLose[25 - 1]}`);
console.log(`Total bets: ${results.bets}`);
console.log(`Total wins: ${results.winRounds * 20}`);
console.log(`Total loses: ${results.bets - results.winRounds * 20}`);
