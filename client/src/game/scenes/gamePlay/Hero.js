import {Assets, Container, Graphics, Sprite} from "pixi.js";
import gsap from "gsap";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";

export class Hero extends SuperContainer {
    constructor() {
        super();

        this.bg = new Sprite(Assets.get('heroNormal'));
        this.bg.anchor.set(0.6, 1);
        this.addChild(this.bg);

        this.jumpState = new Sprite(Assets.get('heroJump'));
        this.jumpState.anchor.set(0.6, 1);
        this.jumpState.visible = false;
        this.addChild(this.jumpState);
    }

    setPosition({x, y}) {
        this.x = x;
        this.y = y;
    }

    startJump(position) {
        const duration = 0.8;

        gsap.killTweensOf(this);
        gsap.killTweensOf(this.scale);
        gsap.killTweensOf(this.position);
        this.setNormalState();

        const timeline = gsap.timeline();
        const dx = Math.abs(this.x - position.x);
        const dy = Math.abs(this.y - position.y);

        timeline
            .add(() => this.setJumpState())
            .to(this, {
                duration: duration / 2,
                x: `+=${dx * 0.7}`,
                y: '-=100',
            })
            .addLabel('jump-half')

        return timeline;
    }

    jumpTo(position) {
        const duration = 0.8;
        const timeline = this.startJump(position);
        const dx = Math.abs(this.x - position.x);
        const dy = Math.abs(this.y - position.y);

        timeline
        .to(this, {
            duration: duration / 2,
            x: `+=${dx * 0.3}`,
            y: position.y,
        })
            .add(() => this.setNormalState(), '-=0.15');

        return timeline
    }

    fallTo(position) {
        const duration = 0.8;
        const timeline = this.startJump(position);
        const dx = Math.abs(this.x - position.x);
        const dy = Math.abs(this.y - position.y);

        timeline
            .add(gsap.to({}, {duration: 0.1}))
            .to(this, {
                delay: 0.2,
                duration: duration,
                x: `+=${dx * 0.3}`,
                y: '+=1000',
            }).to(this, {alpha: 0, duration: 0.2}, '-=0.5');

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
