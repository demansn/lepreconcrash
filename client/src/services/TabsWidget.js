import {EventEmitter} from "@pixi/utils";

export class TabsWidget  extends EventEmitter {
    constructor() {
        super();
        this.widgetID = 320;
        this.tads = window.tads;
        this.container = document.getElementById('popupTadsContainer');
        this.closeBtn = document.getElementById('popupTadsButton');

        this.closeBtn.addEventListener('click', () => {
            this.hidePopup();
        });

        this.hideCloseButton();
    }

    showCloseButton() {
        this.closeBtn.style.display = 'block';
    }

    hideCloseButton() {
        this.closeBtn.style.display = 'none';
    }

    async create(options) {
        this.tads = window.tads;

        if (this.tads) {
            this.adController = this.tads.init({
                widgetId: this.widgetID,
                debug: ENV === 'dev',
                onShowReward: (adId) => {
                    this.emit('showReward', adId);
                },
                onClickReward: (adId) => {
                    this.emit('clickReward', adId);
                },
                onAdsNotFound: () => {
                    this.hidePopup();
                }
            });
        } else {
            window.setTimeout(() => this.create(options), 100);
        }
    }

    showPopup() {
        this.container.style.display = 'block';
    }

    hidePopup() {
        this.container.style.display = 'none';
        this.off('showReward');
        this.off('clickReward');
    }

    async show() {
        if (!this.adController) {
            return false;
        }

        this.hideCloseButton();

        try {
            this.showPopup();
            await this.adController.loadAd();
            await this.adController.showAd();
            this.showCloseButton();
            return true;
        } catch (e) {
            this.showCloseButton();
            return false;
        }
    }
}
