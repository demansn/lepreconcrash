export const GameSteps = [
    {number: 0, multiplier: 1, qualityBonus: 0,  bonusLuck: 0, probabilityToLose: 0.04},
    {number: 1, multiplier: 1.03, qualityBonus: 6875,  bonusLuck: 5, probabilityToLose: 0.04166666667},
    {number: 2, multiplier: 1.06, qualityBonus: 6875,  bonusLuck: 5, probabilityToLose: 0.04347826087},
    {number: 3, multiplier: 1.12, qualityBonus: 6875,  bonusLuck: 5, probabilityToLose: 0.04545454545},
    {number: 4, multiplier: 1.2, qualityBonus: 6875,  bonusLuck: 5, probabilityToLose: 0.04761904762},
    {number: 5, multiplier: 1.25, qualityBonus: 5833,  bonusLuck: 7, probabilityToLose: 0.05},
    {number: 6, multiplier: 1.3, qualityBonus:  5833,  bonusLuck: 7, probabilityToLose: 0.05263157895},
    {number: 7, multiplier: 1.35, qualityBonus: 5833,  bonusLuck: 7, probabilityToLose: 0.05555555556},
    {number: 8, multiplier: 1.45, qualityBonus: 5833,  bonusLuck: 7, probabilityToLose: 0.05882352941},
    {number: 9, multiplier: 1.55, qualityBonus: 5184,  bonusLuck: 10, probabilityToLose: 0.0625},
    {number: 10, multiplier: 1.65, qualityBonus: 5184,  bonusLuck: 10, probabilityToLose: 0.06666666667},
    {number: 11, multiplier: 1.75, qualityBonus: 5184,  bonusLuck: 10, probabilityToLose: 0.07142857143},
    {number: 12, multiplier: 1.85, qualityBonus: 5184,  bonusLuck: 10, probabilityToLose: 0.07692307692},
    {number: 13, multiplier: 2, qualityBonus: 4167,  bonusLuck: 20, probabilityToLose: 0.08333333333},
    {number: 14, multiplier: 2.25, qualityBonus: 4167,  bonusLuck: 20, probabilityToLose: 0.09090909091},
    {number: 15, multiplier: 2.5, qualityBonus: 4167,  bonusLuck: 20, probabilityToLose: 0.1},
    {number: 16, multiplier: 2.75, qualityBonus: 3788,  bonusLuck: 30, probabilityToLose: 0.1111111111},
    {number: 17, multiplier: 3, qualityBonus: 3788,  bonusLuck: 30, probabilityToLose: 0.1111111111},
    {number: 18, multiplier: 3.5, qualityBonus: 3472,  bonusLuck: 50, probabilityToLose: 0.125},
    {number: 19, multiplier: 4, qualityBonus: 1667,  bonusLuck: 75, probabilityToLose: 0.1428571429},
    {number: 20, multiplier: 5, qualityBonus: 1042,  bonusLuck: 100, probabilityToLose: 0.1666666667},
    {number: 21, multiplier: 6, qualityBonus: 833,  bonusLuck: 150, probabilityToLose: 0.2},
    {number: 22, multiplier: 8, qualityBonus: 694,  bonusLuck: 200, probabilityToLose: 0.25},
    {number: 23, multiplier: 10, qualityBonus: 595,  bonusLuck: 300, probabilityToLose: 0.3333333333},
    {number: 24, multiplier: 20, qualityBonus: 51,  bonusLuck: 500, probabilityToLose: 0.5},
];

function simulateCumulative(iterations) {
    const counts = new Array(GameSteps.length).fill(0);
    const t = GameSteps.reduce((sum, step) => sum + step.probabilityToLose, 0);

    for (let i = 0; i < iterations; i++) {
        const rand = Math.random();
        let cumulative = 0;
        let chosen = -1;

        for (let j = 0; j < GameSteps.length; j++) {
            cumulative += GameSteps[j].probabilityToLose;
            if (rand < cumulative / t) {
                chosen = j;
                break;
            }
        }
        if (chosen === -1) chosen = GameSteps.length - 1;
        counts[chosen]++;
    }
    return counts;
}

/*
Алгоритм 2: Последовательная проверка.
На каждом шаге генерируется новое случайное число, и если оно меньше probabilityToLose,
выбирается этот шаг. Безусловная вероятность для шага i равна:
  P(i) = (∏_{j=0}^{i-1}(1 - probabilityToLose_j)) * probabilityToLose_i
При выбранной конфигурации каждый P(i) должна быть ≈0.04 (т.е. равномерно 1 к 25).
*/
function simulateSequential(iterations) {
    const counts = new Array(GameSteps.length).fill(0);

    for (let i = 0; i < iterations; i++) {
        let chosen = -1;
        for (let j = 0; j < GameSteps.length; j++) {
            if (Math.random() < GameSteps[j].probabilityToLose) {
                chosen = j;
                break;
            }
        }
        if (chosen === -1) chosen = GameSteps.length - 1;
        counts[chosen]++;
    }
    return counts;
}

// Запускаем симуляции
// const iterations = 1_000_000;
// const countsCumulative = simulateCumulative(iterations);
// const countsSequential = simulateSequential(iterations);
//
// // Вывод результатов
// console.log("Алгоритм 1 (кумулятивный):");
// GameSteps.forEach((step, i) => {
//     const freq = (countsCumulative[i] / iterations * 100).toFixed(2);
//     // Теоретическая вероятность по алгоритму 1 равна p_i / sum(p_i)
//     const theoretical = (step.probabilityToLose / GameSteps.reduce((s, st) => s + st.probabilityToLose, 0) * 100).toFixed(2);
//     console.log(`Шаг ${i}: эмпирическая = ${freq}%  (теор. ${theoretical}%)`);
// });
//
// console.log("\nАлгоритм 2 (последовательный):");
// GameSteps.forEach((step, i) => {
//     const freq = (countsSequential[i] / iterations * 100).toFixed(2);
//     // Теоретическая безусловная вероятность для алгоритма 2 должна быть ≈ 4% для каждого шага (при условии равномерного распределения)
//     console.log(`Шаг ${i}: эмпирическая = ${freq}%  (теор. ≈ 4.00%)`);
// });
