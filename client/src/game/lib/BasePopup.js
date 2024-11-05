import {SuperContainer} from "../ObjectFactory.js";

export class BasePopup extends SuperContainer {
    constructor({gameSize}) {
        super();

        this.init({gameSize});
    }

    init({gameSize}) {

    }

    show() {

    }

    hide() {

    }

    showThenHide() {
        const tl = this.gsap.timeline();

        tl.add(this.show());
        tl.add(this.hide());

        return tl;
    }
}
