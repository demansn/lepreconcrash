import {StateWithFooter} from "./StateWithFooter.js";

export class ScreenState extends StateWithFooter {
    enter() {
        super.enter();
        this.scene.show(this.getOption('screen').scene, this.getScreenShowParameters());
    }

    getScreenShowParameters() {
        return {
        };
    }

    exit() {
        super.exit();

        this.scene.hide(this.getOption('screen').scene);
    }
}
