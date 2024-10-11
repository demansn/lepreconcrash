import {Platform} from "./Platform";
import {Hero} from "./Hero";
import gsap from "gsap";
import {sound} from "@pixi/sound";
import {SuperContainer} from "./ObjectFactory";
import {Clouds} from "./Clouds";

export class Level extends SuperContainer {
    constructor() {
        super();

        this.platforms = [];

        this.backLayer = this.create.container();
        this.middleLayer = this.create.container();
        this.frontLayer = this.create.container();
        this.backLayer.create.sprite({texture: 'bg', scale: {x: 1.3, y: 1.3}, y: -320});
        this.movementLayer = this.create.container();

        let levelWidth = 0;

        for (let i = 0; i < 25; i++) {
            const platform = new Platform(i, i === 24);
            platform.setPosition({
                x: 5 +  i * (platform.getWidth() + 15),
                y: 730 + (Math.random() > 0.5 ? (Math.random() * 20) : -(Math.random() * 20))
            })
            this.platforms.push(platform);
            this.movementLayer.addChild(platform);

            levelWidth = platform.x + platform.getWidth();
        }

        this.levelWidth = this.movementLayer.width + 2650;

        this.clouds = this.frontLayer.create.displayObject(Clouds, {levelWidth,  variants: [1, 2, 3, 4], clodScale: 0.5, y: 50});
        this.middleLayer.create.displayObject(Clouds, {levelWidth, clodScale: 0.3, variants: [0], alpha: 0.3, y: 40});

        this.hero = new Hero();
        this.movementLayer.addChild(this.hero);

        this.prevX = 0;
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
        const isBonusStep = bonus.step === step || isWin;

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

        if (isBonus || isWin) {
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
            delay: 0.2,
            onUpdate: this.updateParallax.bind(this)
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

        const showWinBonus = () => {
            this.platforms.forEach(platform => {
                if (platform.isFinal) {
                    platform.showBonus();
                }
            });
        }

        timeline.add(this.platforms.map(p => p.moveToDefaultPosition()))
        timeline.add([
            gsap.to(this.movementLayer, {x:  -platform.x + 110, duration: 0.3, onUpdate: this.updateParallax.bind(this)}),
        ], '-=0.1');
        timeline.add([
            platform.toDark(),
            gsap.to(this.hero, {alpha: 1, duration: 0.1}),
            gsap.from(this.hero.scale, {x: 0, y: 0,  duration: 0.2}),
            () => showWinBonus()
        ]);

        return timeline;
    }

    updateParallax() {
        const dx =  this.movementLayer.x - this.prevX;
        let parallaxSpeedBack = this.backLayer.width / this.levelWidth;

        this.backLayer.x += dx * parallaxSpeedBack;
        this.middleLayer.x += dx * (parallaxSpeedBack * 1.1);
        this.frontLayer.x += dx * (parallaxSpeedBack * 1.5);

        if (this.backLayer.x > 0) {
            this.backLayer.x = 0;
        }

        this.prevX = this.movementLayer.x;
    }
}
