import {Assets} from "pixi.js";
import {manifest} from "../../configs/resources-manifest.js";
import {toFixed} from "../utils.js";
import {GameBaseState} from "./GameBaseState.js";
import {sound} from "@pixi/sound";

export class AssetsLoading extends GameBaseState {
    enter() {
       this.init();
    }

    exit() {
        this.scene.hide('LoadingScene');
    }

    async init() {
        await Assets.init({manifest});
        await Assets.loadBundle('preloader');
        this.scene.show('LoadingScene');
        await this.startLoading();
        await this.logic.initSession();

        if (this.logic.hasUserPhoto()) {
            await Assets.load({alias: 'PlayerPhoto', src: await this.logic.getProfilePhotoURL()});
        } else {
            await Assets.load({alias: 'PlayerPhoto', src: './assets/icons/ProfilePhoto.png'});
        }

        if (localStorage.getItem('onboarding')) {
            this.scene.show('Footer');
            this.scene.show('HeaderScene');
            this.owner.goTo('GamePlayState');
        } else {
            this.owner.goTo('OnboardingState');
        }

        sound.play('mainMusic', {loop: true});
    }

    async startLoading() {
        await Assets.loadBundle('game', this.onProgress.bind(this));
    }

    onProgress(progress) {
        this.scene.call('LoadingScene', 'setProgress', toFixed(progress));
    }
}
