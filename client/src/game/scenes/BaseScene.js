import {SuperContainer} from "../gameObjects/SuperContainer.js";

export class BaseScene extends SuperContainer {
    constructor(props) {
        super(props);

        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }
}
