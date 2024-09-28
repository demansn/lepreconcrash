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

        // add hero under first platform

        this.winAnimation = new WinAnimation();
        this.addChild(this.winAnimation);

        this.bonus = new Bonus();
        this.addChild(this.bonus);

        this.hero = new Hero();
        this.addChild(this.hero);

        this.reset();
    }

    // set bonus to platform
    setBonusToPlatform(platformNumber) {
        const position = this.getPlatformByNumber(platformNumber);

        this.bonus.show();
        this.bonus.x = position.x;
        this.bonus.y = position.y;
    }

    heroJumpTo(platformNumber, isLose, isWin, isBonus, bonus) {
        const platform = this.getPlatformByNumber(platformNumber);

        // const position = this.getPlatformPosition(platformNumber );
        const timeline = gsap.timeline();
        const isBonusStep = bonus.step + 1 === platformNumber

     if (isWin) {
            timeline.add(this.playWinAnimationInPosition(platform));
        }

        if (!isLose) {
            timeline.add([
                gsap.timeline().add(this.hero.jumpTo(platform)).add([
                    gsap.to(platform, {y: `+=10`, duration: 0.3, repeat: 1, yoyo: true, ease: "power1.out"}),
                    gsap.to(this.hero, {y: `+=10`, duration: 0.3, repeat: 1, yoyo: true, ease: "power1.out"}),
                    isBonus && gsap.to(this.bonus, {y:  `+=10`, duration: 0.3, repeat: 1, yoyo: true, ease: "power1.out"})
                ]),
                this.moveTo(platform)
            ]);
        } else {
            if (app.version) {
                timeline.add([
                    gsap.timeline().add(this.hero.fallTo(platform))
                        .add([
                            gsap.to(platform, {y: '+=1500', duration: 0.2, ease: "power1.in"}),
                            bonus.step + 1 === platformNumber && gsap.to(this.bonus, {y: '+=1500', duration: 0.2, ease: "power1.in"}),
                        ], '-=1'),
                    this.moveTo(platform)
                ])
            } else {
                timeline.add([
                    gsap.timeline().add(this.hero.jumpTo(platform)).add([
                        gsap.timeline().add(gsap.to(platform, {y: `+=10`, duration: 0.1})).add(gsap.to(platform, {y: '+=1500', duration: 0.2, ease: "power1.in"})),
                        gsap.timeline().add(gsap.to(this.hero, {y: `+=10`, duration: 0.1})).add(gsap.to(this.hero, {y: '+=1500', duration: 0.2, ease: "power1.in"})),
                        isBonusStep &&  gsap.timeline().add(gsap.to(this.bonus, {y:  `+=10`, duration: 0.1})).add(gsap.to(this.bonus, {y: '+=1500', duration: 0.2, ease: "power1.in"})),
                    ]),
                    this.moveTo(platform)
                ])
            }
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
            duration: 0.7,
            delay: 0.2
        });
    }

    reset() {
        const platform = this.getPlatformByNumber(0);

        this.hero.x = platform.x;
        this.hero.y = platform.y;
        this.hero.alpha = 1;
        this.hero.setNormalState();
        this.x = platform.x + platform.width / 2;
        this.setBonusToPlatform(24);
        this.platforms.forEach(platform => platform.show());
    }

    playWinAnimationInPosition(position) {
        this.winAnimation.x = position.x;
        this.winAnimation.y = position.y - 50;

        return this.winAnimation.play();
    }
}
