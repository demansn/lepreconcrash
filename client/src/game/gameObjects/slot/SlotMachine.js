import {gsap} from "gsap";
import {SuperContainer} from "../SuperContainer.js";
import {SymbolSequenceGenerator} from "./SymbolSequenceGenerator.js";
import {SlotMachineReel} from "./SlotMachineReel.js";

export class SlotMachine extends SuperContainer {
    constructor() {
        super();

        this.bg = this.addObject('slot');
        this.arm = this.addObject(SlotMachineArm, {}, {x:496, y: 170});
        /**
         * @type {SlotMachineReel}
         */
        this.reel = this.addObject(SlotMachineReel, {reel: ['Gold-1', 'Luck-100', 'Star-1000']}, {x: 171, y: 400});
        this.reel.mask = this.reel.addObject('slot_mask_2', {}, {x:-40, y: -182});
        this.symbolSequenceGenerator = new SymbolSequenceGenerator(SlotMachineSymbols);

        this.reel.setSymbols(this.symbolSequenceGenerator.generate({
            length: 3
        }));
    }

    spin(endSymbol) {
        this.reel.setSymbols(this.symbolSequenceGenerator.generate({
            endSymbol,
            length: 30
        }));

        const tl = gsap.timeline();

        tl.add([
            this.reel.spin(),
            this.arm.animate()
        ])

        return tl;
    }

    stop() {
        this.arm.up();
    }
}

export class SlotMachineArm extends SuperContainer {
    constructor() {
        super();

        this.upState = this.addObject('arm_up', {}, {visible: true});
        this.downState = this.addObject('arm_down', {}, {visible: false, y:  220});
    }

    animate() {
        const tl = gsap.timeline();

        tl
            .add(() =>  this.down())
            .add(() =>  this.up(), '+=0.5')

        return tl;
    }

    up() {
        this.upState.visible = true;
        this.downState.visible = false;
    }

    down() {
        this.upState.visible = false;
        this.downState.visible = true;
    }
}

export class SlotMachineSymbol extends SuperContainer {
    constructor({symbol}) {
        super();
        const [name, amount] = symbol.split('-');

        this.addObject(`${name}Symbol`, {}, {anchor: {y: 0.5}});
        this.addObject(`num-${amount}`, {}, {x: 130, anchor: {y: 0.5}});
    }
}

export const SlotMachineSymbols = {
    'Gold-10': { probability: 3.33},
    'Gold-20': { probability: 3.33},
    'Gold-30': { probability: 3.33},
    'Gold-50': { probability: 3.36},
    'Gold-100': { probability: 3.4},
    'Gold-200': { probability: 6.66},
    'Luck-5': { probability: 3.33},
    'Luck-10': { probability: 3.33},
    'Luck-20': { probability: 3.33},
    'Luck-30': { probability: 3.33},
    'Luck-50': { probability: 3.33},
    'Luck-100': { probability: 3.33},
    'Luck-200': { probability: 3.33},
    'Luck-300': { probability: 3.33},
    'Luck-500': { probability: 3.33},
    'Luck-1000': { probability: 6.66},
    'Star-1': { probability: 3.33},
    'Star-2': { probability: 3.33},
    'Star-3': { probability: 3.33},
    'Star-4': { probability: 3.33},
    'Star-5': { probability: 3.33},
    'Star-10': { probability: 3.33},
    'Star-50': { probability: 3.33},
    'Star-100': { probability: 3.33},
    'Star-500': { probability: 6.66},
    'Star-1000': { probability: 6.66},
};
