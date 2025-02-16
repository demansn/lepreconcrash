import {gsap} from "gsap";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {SlotBonusGame} from "../../gameObjects/SlotBonusGame.js";

export class SlotGame extends SuperContainer {
    constructor(props) {
        super(props);

        this.slot = this.addObject(SlotBonusGame)
    }

    show() {
        this.slot.show();
        gsap.to(this, {duration: 0.5, alpha: 1});
    }
}
