import {Assets, Container, Graphics, Sprite} from "pixi.js";

export class Bonus extends Container {
    constructor() {
        super();

        // draw bonus with graphics
        this.bg = new Sprite(Assets.get('bonus'));
        this.bg.scale.set(2);
        this.bg.anchor.set(0.5, 1);
        this.addChild(this.bg);
    }
}
