import {SuperContainer} from "../gameObjects/SuperContainer.js";

export class BaseScene extends SuperContainer {
    constructor(props) {
        super(props);

        this.visible = false;

        if (props && props.zIndex !== undefined) {
            this.zIndex = props.zIndex;
        }
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    disable() {
        this.interactive = false;
        this.interactiveChildren = false;
    }

    enable() {
        this.interactiveChildren = true;
        this.interactive = true;
    }
}
