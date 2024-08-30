import {Assets, Container, Graphics, Sprite} from "pixi.js";
import gsap from "gsap";

export class Hero extends Container {
    constructor() {
        super();

        // draw hero with graphics circle
        this.bg = new Sprite(Assets.get('hero'));
        this.bg.scale.set(2);
        this.bg.anchor.set(0.5, 1);
        this.addChild(this.bg);
    }

    jumpTo(position) {
        const duration = 1;

        return new Promise(r => {
            gsap.to(this, {
            duration: duration / 2,
            x: position.x,
            y: this.y - 100, // Подъем вверх
            ease: "power2.out", // Эффект замедления на пике прыжка
            onComplete: () => {
                gsap.to(this, {
                    duration: duration / 2,
                    y: position.y,
                    ease: "bounce.out",
                    onComplete:r
                });
            }
        });
    });
    }
}
