import {PlayButton} from "./PlayButton.js";
import {app} from "../../../app.js";
import {RoundWinInfo} from "../RoundWinInfo.js";
import gsap from "gsap";
import {SuperContainer} from "../../../gameObjects/SuperContainer.js";

export class Hud extends SuperContainer {
    constructor() {
        super();

        this.cloudsFront = this.create.sprite({texture: 'CloudsFront', anchor: {x: 0.5, y: 1}, x: 's50%', y: 's100%'});
        this.playButton =  this.create.displayObject(PlayButton, {x: 's50%', y: 's80%'});
        this.cloudsBack = this.create.sprite({texture: 'CloudsBack', anchor: {x: 0.5, y: 1}, x: 's50%', y: 's100%'});

        this.roundInfo = this.create.displayObject(RoundWinInfo, {
            x: 's50%',
            y: 's20%'
        });
        this.roundInfo.on('click', () => {
           this.emit('cashOut:clicked');
        });

        this.animateClouds();

        this.playButton.on('go:clicked', () => {
            this.emit('go:clicked');
        });

        this.playButton.on('play:clicked', () => {
            this.emit('play:clicked');
        });
    }

    set({win, multiplier, luck}) {
        this.roundInfo.setValue({
            win,
            multiplier,
            luck
        });
    }

    animateClouds() {
        const timeline = gsap.timeline();
        const duration = 10;
        const dx = 60;

        timeline.add([
            gsap.to(this.cloudsFront, {x:`+=${dx}`, duration, ease: "power1.inOut"}),
            gsap.to(this.cloudsBack, {x:`-=${dx}`, duration, ease: "power2.inOut"})
        ])
            .add([
                gsap.to(this.cloudsFront, {x:`-=${dx}`, duration, ease: "power1.inOut"}),
                gsap.to(this.cloudsBack, {x: `+=${dx}`, duration, ease: "power2.inOut"})
            ]).repeat(-1);
    }

    gotoPlayState() {
        this.playButton.enable();
        this.playButton.toggleToPlay();
        this.roundInfo.disable();
    }

    gotoGoState() {
        this.playButton.enable();
        this.playButton.toggleToGo();
        this.roundInfo.enable();
    }

    gotoWaitState() {
        this.playButton.disable();
        this.roundInfo.disable();
    }

    animateTo() {
        return this.roundInfo.animateToZero();
    }

    updateRoundInfo(result) {
        this.roundInfo.setValue({
            win: result.win,
            multiplier: result.multiplier,
            luck: result.luck
        });
    }
}
