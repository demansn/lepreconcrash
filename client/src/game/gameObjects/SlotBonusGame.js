import {SuperContainer} from "./SuperContainer.js";
import {SlotMachine} from "./slot/SlotMachine.js";
import {FancyButton} from "@pixi/ui";
import {gsap} from "gsap";

export class SlotBonusGame extends SuperContainer {
    constructor() {
        super();

        this.create.sprite({texture: 'slot_bg'});

        /**
         * @type {SlotMachine}
         */
        this.slotMachine = this.addObject(SlotMachine, {}, {x: 64, y: 212});
        this.spinBn = this.addObject(FancyButton, {
            defaultView: 'spin_default',
            pressedView: 'spin_pressed',
            disabledView: 'spin_pressed',
            anchorY: 1,
            anchorX: 0.5
        }, {x:'s50%', y: 1115});

        this.spinBn.onPress.connect(this.onSpin.bind(this));
        this.alpha = 0;
        this.visible = false;

        this.coins = this.create.sprite({texture: 'coins'});
        this.coins.y -= this.coins.height;
    }

    /**
     *
     * @returns {gsap.core.Tween}
     */
    show(fast) {
        this.alpha = 0;
        this.visible = true;

        if (fast) {
            this.alpha = 1;
            this.visible = true;

            return undefined;
        }

        return  gsap.to(this, {alpha: 1, duration: 0.5});
    }

    /**
     *
     * @returns {gsap.core.Tween}
     */
    hide() {
        return gsap.to(this, {alpha: 0, duration: 0.5}).eventCallback('onComplete', () => {
            this.visible = false;
        });
    }

    setEnabledSpin(enabled) {
        this.spinBn.enabled = enabled;
    }

    onSpin() {
        this.emit('spin:clicked');
    }

    /**
     *
     * @param resultSymbol
     * @returns {gsap.core.Timeline}
     */
    spin(resultSymbol) {
        return this.slotMachine.spin(resultSymbol);
    }

    showCoinsAnimation() {
        this.coins.y = -this.coins.height;

        return gsap.to(this.coins, {y: this.gameSize.height, duration: 1.5});
    }
}
