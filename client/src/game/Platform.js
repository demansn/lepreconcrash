import gsap from "gsap";
import {SuperContainer} from "./ObjectFactory";
import {NextStepWin} from "./hud/NextStepWin";

export class Platform extends  SuperContainer {
    constructor(number, isFinal) {
        super();
        this.number = number;
        this.isFinal = isFinal;

        this.bgLight = this.create.sprite({texture: 'platformLight', anchor: {x: 0.5, y: 0.3}});
        this.bgDark = this.create.sprite({texture: 'platformDark', anchor: {x: 0.5, y: 0.3}, alpha: 1});
        this.shadow = this.create.sprite({texture: 'Shadow', anchor: {x: 0.5, y: 0.5}, alpha: 0});
        this.bonus = this.create.sprite({texture: isFinal ? 'FinalCash' : 'bonus', layer: 'hud',anchor: {x: 0.5, y: isFinal ? 0.8: 1}, alpha: 0});
        this.winValue = this.create.displayObject(NextStepWin,{layer: 'hud', y: -75, alpha: 0});

        this.winAnimation = this.create.animation('Fx05', {layer: 'hud', x: 0, y: -75, alpha: 0, anchor: {x: 0.5, y: 0.5}, scale: {x: 0.5, y: 0.5}});
        this.winAnimation.stop();
        this.winAnimation.loop = false;
    }

    getWidth() {
        return this.bgLight.width;
    }

    showBonus() {
        this.bonus.alpha = 1;
        this.bgDark.alpha = 1;
        this.shadow.alpha = 1;
    }

    hideBonus() {
        this.bonus.alpha = 0;
    }

    hideBonusAnimation() {
        const timeline = gsap.timeline();

        this.winAnimation.currentFrame = 0;

        timeline.add([
            gsap.to(this.winAnimation, {duration: 0.01, alpha: 1}),
            gsap.to(this.bonus, {duration: 0.01, alpha: 0}),
            gsap.to(this.winAnimation, {duration: 0.4, currentFrame: this.winAnimation.totalFrames - 1}),
        ]);

        timeline.to(this.winAnimation, {duration: 0.1, alpha: 0});

        return timeline;
    }

    toDark() {
        const timeline = gsap.timeline();
        const duration = 0.5;

        return timeline.add([
            // gsap.to(this.bgDark, {duration, alpha: 1}),
            gsap.to(this.shadow, {duration, alpha: 1}),
        ]);
    }

    toLight(duration = 0.4) {
        const timeline = gsap.timeline();

        return timeline.add([
            gsap.to(this.shadow, {duration, alpha: 0}),
        ]);
    }

    showWinValue(value) {
        this.winValue.setValue(value);
        this.winValue.scale.set(0);

        return gsap.timeline([
            gsap.to(this.winValue, {duration: 0.1, alpha: 1}),
            gsap.to(this.winValue.scale, {duration: 0.2, x: 1, y: 1})
        ]);
    }

    hideWinValue() {
        return gsap.timeline([
            gsap.to(this.winValue, {duration: 0.1, alpha: 1}),
            gsap.to(this.winValue.scale, {duration: 0.1, x: 0, y: 0})
        ]);
    }

    setPosition({x, y}) {
        this.defaultPosition = {x, y};
        this.x = x;
        this.y = y;
    }

    moveToDefaultPosition() {
        return gsap.to(this, {x: this.defaultPosition.x, y: this.defaultPosition.y, duration: 0.2});
    }
}
