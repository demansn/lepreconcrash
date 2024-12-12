import {GameBaseState} from "./GameBaseState.js";

export class OnboardingState extends GameBaseState {
    enter() {
        this.scene.show('OnboardingScene');
        this.scene.on('OnboardingScene', 'play', this.onPlay.bind(this));
    }

    onPlay() {
        this.owner.goTo('GamePlayState');
    }

    exit() {
        this.scene.hide('OnboardingScene');
        this.scene.offAll('OnboardingScene', ['play']);
        this.scene.show('Footer');
        this.scene.show('HeaderScene');
        localStorage.setItem('onboarding', 'true');
    }
}
