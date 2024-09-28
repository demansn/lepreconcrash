import {SuperContainer} from "./ObjectFactory";
import gsap from "gsap";

export class RoundWinInfo extends SuperContainer {
    constructor() {
        super();

        this.button = this.create.container({
            x: 0,
            y: 0,
            interactive: true,
            buttonMode: true,
            cursor: 'pointer'
        });

        this.bg = this.button.create.sprite({
            texture: 'centerButton',
            anchor: 0.5
        });

        this.button.create.displayObject(GrabGoldIcon, {
            y: 100,
            x: '-50%',
        });

        this.winText = this.button.create.text({
            style: 'roundWinInfoWinValue',
            text: 100,
            anchor: 0.5,
            y: -60
        });

        this.multiplerText = this.create.text({
            style: 'roundWinInfoMultiplierValue',
            text: 'x1.35',
            anchor: 0.5,
            x: -(this.bg.width / 2 + 200)
        });

        this.luckText = this.create.displayObject(CloverValue,{
            x: this.bg.width / 2 + 120
        });

        this.button.on('pointerdown', () => {
            this.button.scale.set(0.9);
        });

        this.button.on('pointerup', () => {
            this.button.scale.set(1);
            this.emit('click');
        });

        this.button.on('pointerupoutside', () => {
            this.button.scale.set(1);
            this.emit('click');
        });

        this.setValue({win: 0, multiplier: 0, luck: 0});
    }

    setValue({win, multiplier, luck}) {
        this.win = win;
        this.multiplier = multiplier;
        this.luck = luck;

        this.winText.text = win;
        this.multiplerText.text = `x${multiplier}`;
        this.luckText.text = luck;
    }

    animateToZero() {
        const timeline = gsap.timeline();

        timeline.add([
            this.animateValue('win', 0, () => this.winText.text = Math.floor(this.win)),
            this.animateValue('multiplier', 0, () => this.multiplerText.text = `x${this.multiplier.toFixed(2)}`),
            this.animateValue('luck', 0, () => this.luckText.text = this.luck.toFixed(0))
        ]);

        return timeline;
    }

    animateValue(valueName, value, onUpdate) {
       return gsap.to(this, {duration: 0.2, [valueName]: value}).eventCallback('onUpdate', onUpdate);
    }

    disable() {
        this.button.interactive = false;
        this.button.buttonMode = false;
    }

    enable() {
        this.button.interactive = true;
        this.button.buttonMode = true;
    }
}

export class CloverValue extends SuperContainer {
    constructor() {
        super();

        this.icon = this.create.sprite({
            texture: 'goldCloverCenter',
            anchor: {y: 0.5}
        });

        this.textObject = this.create.text({
            style: 'roundWinInfoLuckValue',
            text: "1",
            anchor: {y: 0.5},
            x: this.icon.width + 5
        });
    }

    set text(value) {
        this.textObject.text = value;
    }

    get text() {
        return this.textObject.text;
    }
}

export class GrabGoldIcon extends SuperContainer {
    constructor() {
        super();

        this.icon = this.create.sprite({
            texture: 'goldIconCenter',
            anchor: {y: 0.5}
        });

        this.text = this.create.text({
            style: 'grabGoldIconText',
            text: "GRAB GOLD",
            anchor: {y: 0.5},
            x: this.icon.width + 2
        });
    }
}
