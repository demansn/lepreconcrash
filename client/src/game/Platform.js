import {Assets, Container, Graphics, Sprite} from "pixi.js";
import gsap from "gsap";

export class Platform extends  Container {
    constructor(number) {
        super();
        this.number = number;

        // draw platform with graphics
        this.bg = new Sprite(Assets.get('platform'));
        this.bg.anchor.set(1, 0);
        this.bg.scale.set(0.8);
        this.addChild(this.bg);
    }

    show(){
        this.alpha = 1;
    }

    hide() {
        return gsap.to(this, {alpha: 0, delay: 0.4, duration: 0.5});
    }
}
