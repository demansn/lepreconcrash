export class SymbolSequenceGenerator {
    constructor(symbolProbabilities) {
        this.symbolProbabilities = this.#normalizeProbabilities(symbolProbabilities);
        this.sortedSymbols = this.#sortSymbolsByValue(symbolProbabilities);
    }

    #normalizeProbabilities(symbolProbabilities) {
        const total = Object.values(symbolProbabilities).reduce((sum, { probability }) => sum + probability, 0);
        return Object.fromEntries(
            Object.entries(symbolProbabilities).map(([symbol, { probability }]) => [
                symbol, (probability / total) * 100
            ])
        );
    }

    #getRandomSymbol() {
        const rand = Math.random() * 100;
        let cumulativeProbability = 0;

        for (const [symbol, probability] of Object.entries(this.symbolProbabilities)) {
            cumulativeProbability += probability;
            if (rand <= cumulativeProbability) return symbol;
        }
        return Object.keys(this.symbolProbabilities)[0];
    }

    generate({ start = [], endSymbol = this.#getRandomSymbol(), length }) {
        if (length < start.length + 1) {
            throw new Error("Длина последовательности слишком мала для размещения start и end.");
        }

        const middleLength = length - start.length;
        const middle = Array.from({ length: middleLength }, () => this.#getRandomSymbol());

        return [...start, ...middle, ...this.generateTriple(endSymbol)];
    }

    generateTriple(middleSymbol) {
        const middleValue = parseInt(middleSymbol.split('-')[1]);

        const leftSymbol = middleValue < 100 ? this.#getExtremeSymbol('high') : this.#getExtremeSymbol('low');
        const rightSymbol = middleValue < 100 ? this.#getExtremeSymbol('high') : this.#getExtremeSymbol('low');

        return [leftSymbol, middleSymbol, rightSymbol];
    }

    #sortSymbolsByValue(symbols) {
        return Object.keys(symbols ).sort((a, b) => {
            const numA = parseInt(a.split('-')[1]);
            const numB = parseInt(b.split('-')[1]);
            return numA - numB;
        });
    }

    #getExtremeSymbol(type) {
        const range = type === 'low' ? this.sortedSymbols.slice(0, 5) : this.sortedSymbols.slice(-5);
        return range[Math.floor(Math.random() * range.length)];
    }
}

