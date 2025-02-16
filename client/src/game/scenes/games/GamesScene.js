import {gsap} from "gsap";
import {ScreenScene} from "../ScreenScene.js";
import {CardsTabs} from "../../gameObjects/tabs/CardsTabs.js";
import {GameCard} from "./GameCard.js";
import {CookieGame} from "./CookieGame.js";
import {SlotBonusGame} from "../../gameObjects/SlotBonusGame.js";
import {Button} from "@pixi/ui";
import {ResultPopup} from "../popupManager/popup/ResultPopup.js";

export class GamesScene extends ScreenScene {
    constructor() {
        super({name: 'games'});

        this.content = this.create.container();

        this.tasksTabs = this.create.displayObject(CardsTabs, {
            x: 21,
            y: 128,
            buttons: ['GAMES'],
            tabsByType: {
                games: [
                    {id: 'slot', icon: 'SlotIcon', title: 'BONUS SLOT GAME', constructor: GameCard, onClick: this.onClickPlay.bind(this)},
                    {id: 'cookie', icon: 'CookieIcon', title:  'FORTUNE COOKIE GAME', constructor: GameCard, onClick: this.onClickPlay.bind(this)},
                ],
            },
        });

        /**
         * @type {SlotBonusGame}
         */
        this.slotGame = this.addObject(SlotBonusGame, {}, {alpha: 0});
        this.slotGame.on('spin:clicked', this.onClickSpin.bind(this));
        this.cookieGame = this.addObject(CookieGame, {}, {alpha: 0});

        const text = this.create.text({text: '×', style: 'CloseButtonX'});
        text.x = 600;
        text.y = 110;
        text.alpha = 0;

        this.closeButton = new Button(text);
        this.closeButton.onPress.connect(this.onClickClose.bind(this));
        this.addChild(text);

        /**
         * @type {ResultPopup}
         */
        this.popup = this.create.displayObject(ResultPopup, {visible: false, layer: 'popup'});
    }

    onClickSpin() {
        this.emit('spin');
    }

    disableUI() {
        this.slotGame.setEnabledSpin(false);
        this.closeButton.enabled = false;
    }

    enableUI() {
        this.slotGame.setEnabledSpin(true);
        this.closeButton.enabled = true;
    }

    spin(symbol) {
        const tl = gsap.timeline();

        tl.add(this.slotGame.spin(symbol));
        tl.add(this.slotGame.showCoinsAnimation());

        return tl.then();
    }

    showWinPopup(reward) {
        this.popup.visible = true;

        return this.popup.showThenHide(reward).then(() => {
            this.popup.visible = false;
        });
    }

    onClickClose() {
        this.emit('closeGame');
    }

    onClickPlay(game) {
        this.emit('playGame', {game});
    }

    close() {

    }

    showCloseButton() {
        gsap.to(this.closeButton.view, {duration: 0.5, alpha: 1});
    }

    hideCloseButton() {
        gsap.to(this.closeButton.view, {duration: 0.5, alpha: 0});
    }

    showSlotGame() {
        this.slotGame.show();
        this.showCloseButton();
    }

    showCookieGame() {
        this.cookieGame.show();
        this.showCloseButton();
    }

    hideSlotGame() {
        this.slotGame.hide();
        this.hideCloseButton();
    }

    hideCookieGame() {
        this.cookieGame.hide();
        this.hideCloseButton();
    }
}
