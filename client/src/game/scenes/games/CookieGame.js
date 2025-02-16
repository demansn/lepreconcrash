import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {InlineBlock} from "../../gameObjects/InlineBlock.js";
import {FancyButton} from "@pixi/ui";
import {gsap} from "gsap";
import {VerticalBlock} from "../../gameObjects/VerticalBlock.js";

export class CookieGame extends SuperContainer {
    constructor() {
        super();

        this.addObject('CoockieGameBG');
        this.cookie = this.addObject(Cookie, {}, {x: 's50%', y: 's50%'});

        /**
         * @type {FancyButton}
         */
        this.openButton = this.addObject(FancyButton, {
            defaultView: 'CoockieButtonDefault',
            pressedView: 'CoockieButtonPressed',
            disabledView: 'CoockieButtonPressed',
            anchorY: 1,
            anchorX: 0.5
        }, {x:'s50%', y: 1115});

        this.openButton.onPress.connect(this.onClickOpen.bind(this));

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

    onClickOpen() {
        this.emit('open');
    }

    disableUI() {
        this.openButton.enabled = false;
    }

    enableUI() {
        this.openButton.enabled = true;
    }

    openCookie(message) {
        this.cookie.open(message);
    }

    closeCookie() {
        this.cookie.close();
    }


    showCoinsAnimation() {
        this.coins.y = -this.coins.height;

        return gsap.to(this.coins, {y: this.gameSize.height, duration: 1.5});
    }
}


export class Cookie extends SuperContainer {
    constructor() {
        super();

        this.openedState = this.addObject('CoockieClosed', {}, {anchor: 0.5});
        this.closedState = this.addObject('CoockieOpen', {}, {anchor: {x: 0.5, y: 0.55}});

        this.winContent = this.addObject(VerticalBlock, {verticalAlign: 'middle', horizontalAlign: 'center', gap: 20}, {y: -170, visible: false});
        this.winContent.addObject('CoockieGameWinIcon',);
        this.message = this.winContent.create.text({style: 'CookieMessage', text: 'You won 1 cookie!'});

        this.close();
    }

    open(message) {
        this.openedState.visible = false;
        this.closedState.visible = true;
        this.winContent.visible = true;
        this.message.text = message;
        this.winContent.layout();
        this.winContent.pivot.x = this.winContent.width / 2;
    }

    close() {
        this.openedState.visible = true;
        this.closedState.visible = false;
        this.winContent.visible = false;
    }
}
