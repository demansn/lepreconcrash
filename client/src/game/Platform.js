import {Assets, Container, Graphics, Sprite} from "pixi.js";
import gsap from "gsap";

export class Platform extends  Container {
    constructor(number) {
        super();
        this.number = number;

        // draw platform with graphics
        this.bg = new Sprite(Assets.get('platform'));
        this.bg.anchor.set(0.5, 0.3);
        this.bg.scale.set(0.8);
        this.addChild(this.bg);
    }

    setPosition({x, y}) {
        this.defaultPosition = {x, y};
        this.x = x;
        this.y = y;
    }

    show(){
        this.alpha = 1;
        this.x = this.defaultPosition.x;
        this.y = this.defaultPosition.y;
    }
}
