import {Hud} from "./hud/Hud.js";
import {Level} from "./Level.js";
import gsap from "gsap";
import {sound} from "@pixi/sound";
import {ResultPopup} from "../popupManager/popup/ResultPopup.js";
import {BaseScene} from "../BaseScene.js";

/**
 * Represents the gameplay scene.
 * Extends the BaseScene to provide the main game interaction and display.
 */
export class GamePlayScene extends BaseScene {
    constructor() {
        super();
        this.zOrder = 1;
        this.zIndex = 1;

        this.level = new Level(10);
        this.addChild(this.level);

        this.hud = new Hud();
        this.addChild(this.hud);

        this.popup = this.create.displayObject(ResultPopup, {visible: false, layer: 'popup'});

        this.hud.on('go:clicked', () => {
            this.emit('go');
        })

        this.hud.on('play:clicked', () => {
            this.emit('placeBet');
        });

        this.hud.on('cashOut:clicked', () => {
            this.emit('cashOut');
        });
    }

    init({gameRound}) {
        const levelParameters = {
            currentStep: gameRound ? gameRound.step : 0,
            bonusStep: gameRound ? gameRound.bonus.step : undefined,
            nextStepWin: gameRound ? gameRound.nextStepWin : undefined
        };

        const hudParameters = {
            win: gameRound ? gameRound.win : 0,
            multiplier: gameRound ? gameRound.multiplier : 0,
            luck: gameRound ? gameRound.luck : 0,
        };

        this.level.set(levelParameters);
        this.hud.set(hudParameters);
    }

    showWinPopup({bet, win, luck}) {
        this.popup.visible = true;
        this.hud.interactiveChildren = false;
        this.level.interactiveChildren = false;

        return this.popup.showThenHide({bet, win, luck}).add(() => {
            this.popup.visible = false;
            this.hud.interactiveChildren = true;
            this.level.interactiveChildren = true;
        });
    }

    wait() {
        this.hud.gotoWaitState();
    }

    waitPlaceBet() {
        this.hud.gotoPlayState();
    }

    waitGo() {
        this.hud.gotoGoState();
    }

    play({gameRound, info}) {
        const {bonus, nextStepWin, step} = gameRound;

        this.level.setBonusToPlatform(bonus.step);
        this.level.setNextStepWin({step: step + 1, nextStepWin});

        this.hud.updateRoundInfo(gameRound)
    }

    updateHUD({win = 0, multiplier = 0, luck = 0}) {
        this.hud.updateRoundInfo({win, multiplier, luck});
    }

    cashOut(result, roundResult) {
        const timeline = gsap.timeline();

        sound.play('cashGrab');
        this.hud.gotoWaitState();
        this.hud.roundInfo.animateCashGrabAnimation();
        this.hud.animateTo(result);

        this.showWinPopup({bet: roundResult.bet, win: roundResult.win, luck: roundResult.luck})

        timeline.to({}, {duration: 0.3});

        return timeline;
    }

    go(result, info) {
        const timeline = gsap.timeline();

        timeline
            .add(() => this.hud.gotoWaitState())
            .add(() => {sound.play('jump')} )
            .add(this.level.heroJumpTo(result))
            .add(() => {
                if (!result.isLose) {
                    !result.isWin && this.hud.gotoGoState();
                    this.hud.updateRoundInfo(result);
                } else {
                    this.hud.roundInfo.animateToZero()
                }
            }, '-=0.95')
            .add(() => {
                if (result.isLose) {
                    this.lose();
                } else if(result.isWin) {
                    this.win(info, result);
                }
            });

        return timeline;
    }

    lose() {
        this.emit('lose');
    }

    win(info, result) {
        this.emit('win');
    }

    winRoundAnimation(result) {
        const timeline = gsap.timeline();

        timeline
            .add(this.hud.animateTo(result))
            .add([
                () => this.reset(),
                () => this.showWinPopup({bet: result.round.bet, win: result.round.totalWin, luck: result.round.luck})
            ], '+=0.2')
    }

    reset() {
        return this.level.reset().add(() => this.hud.gotoPlayState());
    }
}
