import gsap from "gsap";
import {SuperContainer} from "./ObjectFactory";
import {NextStepWin} from "./hud/NextStepWin";

export class Platform extends  SuperContainer {
    constructor(number) {
        super();
        this.number = number;

        this.bg = this.create.sprite({texture: 'platform', anchor: {x: 0.5, y: 0.3}, scale: {x: 0.8, y: 0.8}});
        this.bonus = this.create.sprite({texture: 'bonus', anchor: {x: 0.5, y: 1}, alpha: 0});
        this.winValue = this.create.displayObject(NextStepWin,{layer: 'hud', y: -150, alpha: 0});
    }

    showBonus() {
        this.bonus.alpha = 1;
    }

    hideBonus() {
        this.bonus.alpha = 0;
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
