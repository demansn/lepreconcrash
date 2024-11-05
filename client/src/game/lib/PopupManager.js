import {SuperContainer} from "../ObjectFactory.js";

export class PopupManager extends SuperContainer {
    constructor({gameSize, popups}) {
        super();

        this.gameSize = gameSize;
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
