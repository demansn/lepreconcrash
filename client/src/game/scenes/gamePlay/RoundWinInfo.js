import gsap from "gsap";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {VerticalBlock} from "../../gameObjects/VerticalBlock.js";

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
            scale: {x: 0.9, y: 0.9},
            anchor: 0.5
        });

        this.button.create.displayObject(GrabGoldIcon, {
            y: 50,
            x: '-50%',
        });

        this.winText = this.button.create.text({
            style: 'roundWinInfoWinValue',
            text: 100,
            anchor: 0.5,
            y: -30
        });

        this.multiplerText = this.create.text({
            style: 'roundWinInfoMultiplierValue',
            text: 'x1.35',
            anchor: 0.5,
            x: -(this.bg.width / 2 + 90)
        });

        this.rightColumnt = this.create.displayObject(VerticalBlock,  {x:  this.bg.width / 2 + 40, parameters: {gap: 10, verticalAlign: 'middle', horizontalAlign: 'left', pivotAlign: [undefined, 'middle']}});
        this.luckText = this.rightColumnt.create.displayObject(CloverValue);
        this.starsValue = this.rightColumnt.create.displayObject(StarsValue, {visible: false});
        this.rightColumnt.layout();

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

        this.cashGrabAnimation = this.button.create.animation({animation: 'Fx10', alpha: 0, anchor: 0.5, scale: {x: 1.1, y: 1.1}});
        this.cashGrabAnimation.stop();
        this.cashGrabAnimation.animationSpeed = -0.5;

        this.setValue({win: 0, multiplier: 0, luck: 0});
    }

    animateCashGrabAnimation() {
        const timeline = gsap.timeline();
        this.cashGrabAnimation.currentFrame = 0;

        timeline.add([
            gsap.to(this.cashGrabAnimation, {alpha: 1, duration: 0.1}),
            gsap.to(this.cashGrabAnimation, {currentFrame: this.cashGrabAnimation.totalFrames - 1, duration: 0.6})
        ])
            .add(gsap.to(this.cashGrabAnimation, {alpha: 0, duration: 0.01}))

        return timeline;
    }

    setValue({win, multiplier, luck, stars}) {
        this.win = win;
        this.multiplier = multiplier;
        this.luck = luck;
        this.stars = stars || 0;

        this.winText.text = win;
        this.multiplerText.text = `x${multiplier}`;
        this.luckText.text = luck;

        this.starsValue.visible = stars;

        if (stars) {
            this.starsValue.text = stars;
        }

        this.rightColumnt.layout();
    }

    animateToZero() {
        const timeline = gsap.timeline();

        timeline.add([
            this.animateValue('win', 0, () => this.winText.text = Math.floor(this.win)),
            this.animateValue('multiplier', 0, () => this.multiplerText.text = `x${this.multiplier.toFixed(2)}`),
            this.animateValue('luck', 0, () => this.luckText.text = this.luck.toFixed(0)),
            this.animateValue('stars', 0, () => this.starsValue.text = this.stars.toFixed(0))
        ]);

        timeline.add(() => {
            this.starsValue.visible = false;
            this.rightColumnt.layout();
        });

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
        });

        this.textObject = this.create.text({
            style: 'roundWinInfoLuckValue',
            text: "1",
            anchor: {y: 0.5},
            y: this.icon.height / 2,
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
            texture: 'CoinIcon',
            anchor: {y: 0.5},
            width: 40,
            height: 40,
        });

        this.text = this.create.text({
            style: 'grabGoldIconText',
            text: "GRAB GOLD",
            anchor: {y: 0.5},
            x: this.icon.width + 2
        });
    }
}

export class StarsValue extends SuperContainer {
    constructor() {
        super();

        this.icon = this.create.sprite({
            texture: 'StarSymbol',
            scale: 0.6
        });

        this.textObject = this.create.text({
            style: 'roundWinInfoLuckValue',
            text: "1",
            anchor: {y: 0.5},
            y: this.icon.height / 2,
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

