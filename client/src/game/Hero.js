import {Assets, Container, Graphics, Sprite} from "pixi.js";
import gsap from "gsap";

export class Hero extends Container {
    constructor() {
        super();

        this.scale.set(0.6);
        // draw hero with graphics circle
        this.bg = new Sprite(Assets.get('heroNormal'));
        this.bg.anchor.set(0.5, 0.75);
        this.addChild(this.bg);

        this.jumpState = new Sprite(Assets.get('heroJump'));
        this.jumpState.anchor.set(0.5, 0.75);
        this.jumpState.visible = false;
        this.addChild(this.jumpState);
    }

    jumpTo(position) {
        const duration = 1;

        const timeline = gsap.timeline();

        timeline
            .add(() => this.setJumpState())
            .to(this, {
            duration: duration / 2,
            x: position.x,
            y: this.y - 100, // Подъем вверх
            ease: "power2.out", // Эффект замедления на пике прыжка
        })
        .to(this, {
            duration: 0.2,
            y: position.y,
            // эффект падения
            ease: "power1.in"
        })
            .add(() => this.setNormalState())

        return timeline
    }

    setJumpState() {
        this.jumpState.visible = true;
        this.bg.visible = false;
    }

    setNormalState() {
        this.jumpState.visible = false;
        this.bg.visible = true;
    }
}
