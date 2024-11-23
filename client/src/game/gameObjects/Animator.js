import gsap from "gsap";

export class Animator {
    constructor(parentDisplayObject) {
        this.parentDisplayObject = parentDisplayObject;
        this.tweens = [];
    }

    tweenTo(properties) {
        const tween = gsap.to(this.parentDisplayObject, properties);

        this.tweens.push(tween);

        return tween;
    }

    timeline() {
        const timeline = gsap.timeline();

        this.tweens.push(timeline);

        return timeline;
    }

    killTweens() {
        this.tweens.forEach(tween => tween.kill());
    }
}
