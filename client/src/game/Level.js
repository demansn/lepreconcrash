import {Assets, Container, Sprite, Text} from "pixi.js";
import {Platform} from "./Platform";
import {WinAnimation} from "./WinAnimation";
import {Bonus} from "./Bonus";
import {Hero} from "./Hero";
import gsap from "gsap";

export class Level extends Container {
    constructor() {
        super();

        this.platforms = [];

        // add 25 platform on bottom
        for (let i = 0; i < 25; i++) {
            const platform = new Platform(i);
            platform.x = 10 +  i * (platform.width + 30);
            platform.y = 1440;
            this.platforms.push(platform);
            this.addChild(platform);
        }

        // add hero under first platform

        this.winAnimation = new WinAnimation();
        this.addChild(this.winAnimation);

        this.bonus = new Bonus();
        this.bonus.x = this.getPlatformPosition(24).x;
        this.bonus.y = this.getPlatformPosition(24).y;
        this.addChild(this.bonus);

        this.hero = new Hero();
        this.hero.x = this.getPlatformPosition(0).x;
        this.hero.y = this.getPlatformPosition(0).y;
        this.addChild(this.hero);
    }

    // get center platform position to hero jump by platrom number
    getPlatformPosition(platformNumber) {
        const platform = this.platforms.find(child => child.number === platformNumber);

        return {
            x: platform.x + platform.width / 2,
            y: platform.y
        };
    }

    // set bonus to platform
    setBonusToPlatform(platformNumber) {
        const position = this.getPlatformPosition(platformNumber);

        this.bonus.show();
        this.bonus.x = position.x;
        this.bonus.y = position.y + this.bonus.height * 0.75;
    }

    heroJumpTo(platformNumber, isLose, isWin, isBonus) {
        const position = this.getPlatformPosition(platformNumber);
        const timeline = gsap.timeline();

        if (isLose) {
        } else if (isWin) {
            timeline.add(this.playWinAnimationInPosition(position));
        }

        const platform = this.getPlatformByNumber(platformNumber);

        timeline.add([
            this.hero.jumpTo(position),
            this.moveTo(position)
        ]);

            if (!isLose)  {
                timeline.add([
                    gsap.to(platform, {y: platform.y + 10, duration: 0.3, repeat: 1, yoyo: true, ease: "power1.out" }),
                    gsap.to(this.hero, {y: this.hero.y + 10, duration: 0.3, repeat: 1, yoyo: true, ease: "power1.out" }),
                    isBonus && gsap.to(this.bonus, {y: this.bonus.y + 10, duration: 0.3, repeat: 1, yoyo: true, ease: "power1.out" })
                ], '-=0.5');
            } else {
                timeline
                    .add([
                        gsap.timeline().add(gsap.to(this.hero, {y: this.hero.y + 2000, duration: 1, ease: "power1.out"})).add(gsap.to(this.hero, {alpha: 0, duration: 0.2}), '-=0.7'),
                        gsap.to(platform, {y: platform.y + 10, duration: 0.3, ease: "power1.out"}),
                        gsap.to(platform, {alpha: 0, delay: 0.15, duration: 0.15})
                    ], '-=0.5')
            }

        if (isBonus) {
            timeline.add(() => this.hideBonus())
        }

        return timeline;
    }

    hideBonus() {
        return this.bonus.hide();
    }

    getPlatformByNumber(number) {
        return this.platforms.find(platform => platform.number === number);
    }

    moveTo(position) {
        return gsap.to(this, {
            x: -position.x + 220,
            duration: 1,
            delay: 0.25
        });
    }

    reset() {
        this.hero.x = this.getPlatformPosition(0).x;
        this.hero.y = this.getPlatformPosition(0).y;
        this.hero.alpha = 1;
        this.x = 0;
        this.setBonusToPlatform(24);
        this.platforms.forEach(platform => platform.show());
    }

    playWinAnimationInPosition(position) {
        this.winAnimation.x = position.x;
        this.winAnimation.y = position.y - 50;

        return this.winAnimation.play();
    }
}
