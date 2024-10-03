import {Assets, Container, Sprite, Text} from "pixi.js";
import {Hud} from "./hud/Hud";
import {Level} from "./Level";
import gsap from "gsap";
import {SuperContainer} from "./ObjectFactory";

export class GamePlayScene extends SuperContainer {
    constructor(app) {
        super();

        this.zOrder = 1;
        this.zIndex = 1;
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

    cashOut(result) {
        this.hud.roundInfo.animateCashGrabAnimation();

        return this.hud.animateTo(result);
    }

    play({bonusPlatform, nextStepWin}) {
        this.level.setBonusToPlatform(bonusPlatform);
        this.level.setNextStepWin({step: 1, nextStepWin});
        this.hud.gotoGoState();
    }

    go(result, info) {
        const timeline = gsap.timeline();

        timeline
            .add(() => this.hud.gotoWaitState())
            .add(this.level.heroJumpTo(result))
            .add(() => {
                if (!result.isLose) {
                    !result.isWin && this.hud.gotoGoState();
                    this.hud.updateRoundInfo(result);
                } else {
                    this.hud.roundInfo.animateToZero()
                }
            }, '-=0.75')
            .add(() => {
                if (result.isLose) {
                    this.reset();
                    this.hud.gotoPlayState();
                } else if(result.isWin) {
                    this.winRoundAnimation(info);
                }
            });

        return timeline;
    }

    winRoundAnimation(playerInfo) {
        const timeline = gsap.timeline();

        timeline
            .add(this.hud.animateTo(playerInfo))
            .add(() => this.reset(), '+=0.5');
    }

    reset() {
        return this.level.reset().add(() => this.hud.gotoPlayState());
    }
}
