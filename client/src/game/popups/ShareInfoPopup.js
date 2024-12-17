export class ShareInfoPopup {
    constructor() {
            this.popupContainer = document.getElementById('popupContainer');
            this.title = document.getElementById('popupTitle');
            this.input = document.getElementById('popupInput');
            this.shareButton = document.getElementById('popupShareButton');
            this.closeButton = document.getElementById('popupCloseButton');
    }

    static show(data) {
        const popup = new ShareInfoPopup();

        return popup.show(data);
    }

    show({title, placeholder}) {
        this.title.textContent = title;
        this.placeholder = placeholder;
        this.value = '';
        this.popupContainer.style.display = 'block';

        return new Promise(resolve => {
            this.shareButton.onclick = () => {
                this.hide();
                resolve(this.input.value);
            };

            this.closeButton.onclick = () => {
                this.hide();
                resolve();
            };
        })
    }

    hide() {
        this.popupContainer.style.display = 'none';
    }

}
