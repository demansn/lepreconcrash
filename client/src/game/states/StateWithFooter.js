import {GameBaseState} from "./GameBaseState.js";

export class StateWithFooter extends GameBaseState {
    enter() {
        this.initFooter();
        this.scene.on('HeaderScene', 'clickBalance', (state) =>  {
            this.changeState('ShopState');
        });
        this.scene.on('HeaderScene', 'clickLack', (state) =>  {
            this.changeState('MyProfileState');
        });
    }

    initFooter() {
        this.scene.call('Footer', 'select', this.name);
        this.scene.on('Footer', 'selected', (state) =>  {
            this.changeState(state);
        });
    }

    changeState(state) {
        this.owner.goTo(state);
    }

    exit() {
        this.scene.offAll('Footer', ['selected']);
        this.scene.offAll('HeaderScene', ['clickBalance', 'clickLack']);
    }
}
