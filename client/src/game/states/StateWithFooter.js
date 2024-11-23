import {GameBaseState} from "./GameBaseState.js";

export class StateWithFooter extends GameBaseState {
    enter() {
        this.initFooter();
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
    }
}
