import {BaseScene} from "../BaseScene.js";
import {GameConfig} from "../../../configs/gameConfig.js";

export class PopupManager extends BaseScene {
    constructor(popups) {
        super();

        this.setLayer('popup');
        this.gameSize = GameConfig.PixiApplication;
        this.popups = popups;
        this.popupsByName = {};
        this.#createPopups();
    }

    #createPopups() {
        this.popups.forEach((popup) => {
            this.popupsByName[popup.name] = this.create.displayObject(popup, {gameSize: this.gameSize, visible: false});
        });
    }

    showPopup(name, params) {
        if (this.popupsByName[name]) {
            this.popupsByName[name].show(params);
        }
    }

    hidePopup(name) {
        if (this.popupsByName[name]) {
            this.popupsByName[name].hide();
        }
    }
}
