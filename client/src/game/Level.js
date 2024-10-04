import {Platform} from "./Platform";
import {WinAnimation} from "./WinAnimation";
import {Hero} from "./Hero";
import gsap from "gsap";
import {sound} from "@pixi/sound";
import {SuperContainer} from "./ObjectFactory";

export class Level extends SuperContainer {
    constructor() {
        super();

        this.platforms = [];

        this.create.sprite({texture: 'CloudsUp', anchor: {x: 0.5}, x: 's50%', y: 0});
        this.create.sprite({texture: 'CloudsFront', anchor: {x: 0.5, y: 1}, x: 's50%', y: 's100%'});
        this.movementLayer = this.create.container();
        this.create.sprite({texture: 'CloudsBack', anchor: {x: 0.5, y: 1}, x: 's50%', y: 's100%'});

        // add 25 platform on bottom
        for (let i = 0; i < 25; i++) {
            const platform = new Platform(i);
            platform.setPosition({
                x: 5 +  i * (platform.getWidth() + 15),
                y: 730 + (Math.random() > 0.5 ? (Math.random() * 20) : -(Math.random() * 20))
            })
            this.platforms.push(platform);
            this.movementLayer.addChild(platform);
        }

        this.winAnimation = new WinAnimation();
        this.movementLayer.addChild(this.winAnimation);

        this.hero = new Hero();
        this.movementLayer.addChild(this.hero);

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
        const standPlatform = this.getPlatformByNumber(targetPlatformNumber - 1);
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
                nexPlatform && nexPlatform.showWinValue(nextStepWin),
                () => platform.toDark()
            ], 'jump-half')

            timeline.add([
                () => standPlatform.toLight(),
                jumpTimeline
                    .add([
                        () => sound.play('landing'),
                        gsap.to(platform, {y: `+=5`, duration: 0.3, repeat: 1, yoyo: true, ease: "power1.out"}),
                        gsap.to(this.hero, {y: `+=5`, duration: 0.3, repeat: 1, yoyo: true, ease: "power1.out"}),
                    ]),
                this.moveTo(platform)
            ]);
        } else {
            let fall = this.hero.fallTo(platform).add([
                platform.hideWinValue(),
                gsap.to(platform, {y: '+=750', duration: 0.2, ease: "power1.in"}),
                () => sound.play('crash')
            ], 'jump-half');

                timeline.add([
                    () => standPlatform.toLight(),
                    fall,
                    this.moveTo(platform)
                ])
        }

        if (isBonus) {
            timeline.add(() => {
                sound.play('bonusWin');
                platform.hideBonusAnimation();
            }, '-=1');
        }

        return timeline;
    }

    getPlatformByNumber(number) {
        return this.platforms.find(platform => platform.number === number);
    }

    moveTo(position) {
        return gsap.to(this.movementLayer, {
            x: -position.x + 110,
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
            platform.toLight(0.1);
            gsap.killTweensOf(platform);
        });

        timeline.add(this.platforms.map(p => p.moveToDefaultPosition()))
        timeline.add([
            gsap.to(this.movementLayer, {x:  -platform.x + 110, duration: 0.3})
        ], '-=0.1');
        timeline.add([
            platform.toDark(),
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
