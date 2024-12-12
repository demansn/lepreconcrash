// Level 1 < 1,000
// 1,000 ≤ Level 2 < 2,500
// 2,500 ≤ Level 3 < 5,000
// 5,000 ≤ Level 4 < 10,000
// 10,000 ≤ Level 5 < 20,000
// 20,000 ≤ Level 6 < 50,000
// 50,000 ≤ Level 7 < 100,000
// 100,000 ≤ Level 8 < 200,000
// 200,000 ≤ Level 9 < 500,000
// 500,000 ≤ Level 10

export const PlayerRankLevels = [
    1000,
    2500,
    5000,
    10000,
    20000,
    50000,
    100000,
    200000,
    500000,
    Infinity
];

export const getPlayerRankLevel = (luck) => {
    for (let i = 0; i < PlayerRankLevels.length; i++) {
        if (luck < PlayerRankLevels[i]) {
            return i + 1;
        }
    }
}

export const leftUntilNextRank = (luck) => {
    for (let i = 0; i < PlayerRankLevels.length; i++) {
        if (luck < PlayerRankLevels[i]) {
            return PlayerRankLevels[i] - luck;
        }
    }

    return 0;
}

export const nextRankTarget = (luck) => {
    for (let i = 0; i < PlayerRankLevels.length; i++) {
        if (luck < PlayerRankLevels[i]) {
            return PlayerRankLevels[i];
        }
    }

    return 0;
}

export const LevelsIcon = {
    0: 'Wooden',
    1: 'Wooden',
    2: 'Stone',
    3: 'Plastic',
    4: 'Iron',
    5: 'Copper',
    6: 'Silver',
    7: 'Gold',
    8: 'Pearl',
    9: 'Diamond',
    10: 'Fairy'
};

