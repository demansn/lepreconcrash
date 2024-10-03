import {Assets, Container, Sprite, Text} from "pixi.js";
import {Platform} from "./Platform";
import {WinAnimation} from "./WinAnimation";
import {Bonus} from "./Bonus";
import {Hero} from "./Hero";
import gsap from "gsap";
import {app} from "./app";

export class Level extends Container {
    constructor() {
        super();

        this.platforms = [];

        // add 25 platform on bottom
        for (let i = 0; i < 25; i++) {
            const platform = new Platform(i);
            platform.setPosition({
                x: 10 +  i * (platform.width + 30),
                y: 1440 + (Math.random() > 0.5 ? (Math.random() * 40) : -(Math.random() * 40))
            })
            this.platforms.push(platform);
            this.addChild(platform);
        }

        this.winAnimation = new WinAnimation();
        this.addChild(this.winAnimation);

        this.hero = new Hero();
        this.addChild(this.hero);

        this.reset();
    }

    setNextStepWin({step, nextStepWin}) {
        return this.getPlatformByNumber(step).showWinValue(nextStepWin);
    }

    setBonusToPlatform(platformNumber) {
        const platform = this.getPlatformByNumber(platformNumber);

        platform.showBonus();
    }

    heroJumpTo({step, isLose, isWin, isBonus, bonus, nextStepWin}) {
        const targetPlatformNumber = step + 1;
        const platform = this.getPlatformByNumber(targetPlatformNumber);
        const nexPlatform = this.getPlatformByNumber(targetPlatformNumber + 1);
        const timeline = gsap.timeline();
        const isBonusStep = bonus.step === step;

     if (isWin) {
            timeline.add(this.playWinAnimationInPosition(platform));
        }

        if (!isLose) {
            let jumpTimeline = this.hero.jumpTo(platform).add([
                platform.hideWinValue(),
                nexPlatform && nexPlatform.showWinValue(nextStepWin)
            ], 'jump-half')

            timeline.add([
                jumpTimeline
                    .add([
                        gsap.to(platform, {y: `+=10`, duration: 0.3, repeat: 1, yoyo: true, ease: "power1.out"}),
                        gsap.to(this.hero, {y: `+=10`, duration: 0.3, repeat: 1, yoyo: true, ease: "power1.out"}),
                    ]),
                this.moveTo(platform)
            ]);
        } else {
            let fall = this.hero.fallTo(platform).add([
                platform.hideWinValue(),
                gsap.to(platform, {y: '+=1500', duration: 0.2, ease: "power1.in"})
            ], 'jump-half');

                timeline.add([
                    fall,
                    this.moveTo(platform)
                ])
        }

        if (isBonus) {
            timeline.add(() => platform.hideBonusAnimation(), '-=1');
        }

        return timeline;
    }

    getPlatformByNumber(number) {
        return this.platforms.find(platform => platform.number === number);
    }

    moveTo(position) {
        return gsap.to(this, {
            x: -position.x + 220,
            duration: 0.7,
            delay: 0.2
        });
    }

    reset() {
        const platform = this.getPlatformByNumber(0);
        const timeline = gsap.timeline();

        gsap.killTweensOf(this)
        gsap.killTweensOf(this.hero)
        gsap.killTweensOf(this.hero.scale);

        this.hero.x = platform.x;
        this.hero.y = platform.y;
        this.hero.alpha = 0;
        this.hero.setNormalState();

        this.platforms.forEach(platform => {
            platform.hideWinValue();
            platform.hideBonus();
            gsap.killTweensOf(platform);
        });

        timeline.add(this.platforms.map(p => p.moveToDefaultPosition()))
        timeline.add([
            gsap.to(this, {x: platform.x + platform.width / 2, duration: 0.3})
        ], '-=0.1');
        timeline.add([
            gsap.to(this.hero, {alpha: 1, duration: 0.1}),
            gsap.from(this.hero.scale, {x: 0, y: 0,  duration: 0.2})
        ]);

        return timeline;
    }

    playWinAnimationInPosition(position) {
        this.winAnimation.x = position.x;
        this.winAnimation.y = position.y - 50;

        return this.winAnimation.play();
    }
}
