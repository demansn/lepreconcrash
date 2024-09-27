import {Assets, Container, Sprite, Text} from "pixi.js";
import {Hud} from "./hud/Hud";
import {Level} from "./Level";
import gsap from "gsap";

export class GamePlayScene extends Container {
    constructor(app) {
        super();

        this.bg = new Sprite(Assets.get('bg'));
        // scale height to app height
        this.bg.height = app.screen.height;
        this.bg.width = app.screen.width;
        this.addChild(this.bg);

        this.level = new Level();
        this.addChild(this.level);

        this.hud = new Hud();
        this.addChild(this.hud);
    }

    waitPlaceBet() {
        this.hud.gotoPlayState();
    }

    updateHUD({balance, luck, level, round}) {
        this.hud.balance.setValue(balance);
        this.hud.lack.setValue(luck);
        this.hud.lack.setLevel(level);
        this.hud.updateRoundInfo(round);
    }

    play({bonusPlatform}) {
        this.level.reset();
        this.level.setBonusToPlatform(bonusPlatform);
        this.hud.gotoGoState();
    }

    go(result) {
        const timeline = gsap.timeline();

        timeline
            .add(() => this.hud.gotoWaitState())
            .add(this.level.heroJumpTo(result.step, result.isLose, result.isWin, result.isBonus))
            .add(() => {
                if (!result.isLose) {
                    this.hud.updateRoundInfo(result);
                } else {
                    this.hud.updateRoundInfo({win: 0, multiplier: 0, luck: 0, nextStepWin: 0});
                }
            }, '-=0.5')
            .add(() => {
                if (result.isLose) {
                    this.hud.gotoPlayState();
                } else {
                    this.hud.gotoGoState();
                }
            });

        return timeline;
    }

    reset() {
        this.level.reset();
        this.hud.gotoPlayState();
    }
}
