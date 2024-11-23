import {Assets} from "pixi.js";
import {manifest} from "../../configs/resources-manifest.js";
import {toFixed} from "../utils.js";
import {GameBaseState} from "./GameBaseState.js";

export class AssetsLoading extends GameBaseState {
    enter() {
       this.init();
    }

    exit() {
        console.log('Exiting AssetsLoading');
        this.scene.hide('LoadingScene');
    }

    async init() {
        await Assets.init({ manifest });
        await Assets.loadBundle('preloader');
        this.scene.show('LoadingScene');
        await this.startLoading();
        await this.logic.initSession();
        this.owner.goTo('OnboardingState');
    }

    async startLoading() {
        await Assets.loadBundle('game', this.onProgress.bind(this));
        console.log('Assets loaded');
    }

    onProgress(progress) {
        console.log('Progress', toFixed(progress));
        this.scene.call('LoadingScene', 'setProgress', toFixed(progress));
    }
}
