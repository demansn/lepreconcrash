import { gsap } from "gsap";
import {SuperContainer} from "../SuperContainer.js";
import {SlotMachineSymbol} from "./SlotMachine.js";

export class SlotMachineReel extends SuperContainer {
    constructor({ reel, symbolHeight = 150 }) {
        super();

        this.symbols = new SuperContainer();
        this.addChild(this.symbols);
        this.symbolHeight = symbolHeight;
        this.isSpinning = false;
        this.symbolCount = 0; // Количество символов в барабане
    }

    setSymbols(symbols) {
        const startRow = 1;

        this.symbols.removeChildren();
        this.symbolCount = symbols.length;

        symbols.forEach((symbol, row) => {
            this.#addSymbol(symbol, startRow - row);
        });

        this.symbols.y = 0;
    }

    spin( ) {
        if (this.isSpinning) return;
        this.isSpinning = true;

        const durationPerSymbol = 0.2;
        const totalDistance = this.symbolHeight * (this.symbolCount - 3);

        return gsap.to(this.symbols, {
            y: `+=${totalDistance}`,
            duration: durationPerSymbol * this.symbolCount,
            ease: "back.out(0.5)",
            onComplete: () => {
                this.isSpinning = false;
            }
        });
    }

    #addSymbol(symbol, row) {
        this.symbols.addObject(SlotMachineSymbol, { symbol }, { y: row * this.symbolHeight });
    }
}
