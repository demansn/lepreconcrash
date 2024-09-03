import {Assets, Container, Sprite, Text} from "pixi.js";
import {Platform} from "./Platform";
import {Hero} from "./Hero";
import gsap from "gsap";
import {Bonus} from "./Bonus";
import {WinAnimation} from "./WinAnimation";

export class GamePlayScene extends Container {
    constructor(app) {
        super();

        this.bg = new Sprite(Assets.get('bg'));
        // scale height to app height
        this.bg.height = app.screen.height;
        this.bg.width = this.bg.height / this.bg.texture.height * this.bg.texture.width;

        this.addChild(this.bg);
        this.text = new Text('Hello World', {fill: 0xffffff, align: 'center'});
        this.text.x = app.screen.width / 2;
        this.text.y = app.screen.height / 2;
        this.text.resolution = 2;
        this.text.anchor.set(0.5);
        this.addChild(this.text);


        this.platforms = [];

        // add 25 platform on bottom
        for (let i = 0; i < 25; i++) {
            const platform = new Platform(i);
            platform.x = 10 +  i * (platform.width + 10);
            platform.y = app.screen.height - platform.height;
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
        this.bonus.y = position.y;
    }

    heroJumpTo(platformNumber, isLose, isWin, isBonusStep) {
        const position = this.getPlatformPosition(platformNumber);
        let additinalPromises = [];

        if (isLose) {
            position.y += 500;

            const platform = this.getPlatformByNumber(platformNumber);

            additinalPromises.push(platform.hide());
        } else if (isWin) {
            additinalPromises.push(this.playWinAnimationInPosition(position));
        }

        // hide platform by number

        return Promise.all(
            [
                ...additinalPromises,
                this.hero.jumpTo(position).then(() => {
                    if (isBonusStep) {
                        this.hideBonus();
                    }}),
                this.moveTo(position)
            ]
        )
    }

    hideBonus() {
        this.bonus.hide();
    }

    getPlatformByNumber(number) {
        return this.platforms.find(platform => platform.number === number);
    }

    moveTo(position) {
        return gsap.to(this, {
            x: -position.x + 100,
            duration: 1,
            delay: 0.25
        });
    }

    reset() {
        this.hero.x = this.getPlatformPosition(0).x;
        this.hero.y = this.getPlatformPosition(0).y;
        this.x = 0;
        this.setBonusToPlatform(24);
        this.platforms.forEach(platform => platform.show());
    }

    playWinAnimationInPosition(position) {
        this.winAnimation.x = position.x;
        this.winAnimation.y = position.y - 50;

        return this.winAnimation.play();
    }

    setText(text) {
        this.text.text = text;
    }
}
