import {SuperContainer} from "./SuperContainer.js";

export class TextWithIcon extends SuperContainer {
    constructor({text, textStyle, icon, gap = 8, iconWidth, iconHeight}) {
        super();

        this.value = this.create.text({text: text, style: textStyle});
        this.icon = this.create.object(icon);
        this.gap = gap;

        if (iconWidth) {
            this.icon.width = iconWidth
        }

        if (iconHeight) {
            this.icon.height = iconHeight
        }

        this.icon.y = this.value.height / 2 - this.icon.height / 2;

        this.#update();
    }

    #update() {
        this.icon.x = this.value.width + this.gap;

        const align = this.value.style.align;

        if (align) {
            if (align === 'center') {
                this.value.x = -this.value.width / 2;
                this.icon.x = this.value.width / 2 + this.gap;
            } else if (align === 'right') {
                this.value.x = -this.value.width;
                this.icon.x = this.value.width + this.gap;
            } else if (align === 'left') {
                this.value.x = 0;
                this.icon.x = this.value.width + this.gap;
            }
        }
    }

    set text(value) {
        this.setText(value);
    }

    get text() {
        return this.value.text;
    }

    setText(value) {
        this.value.text = value;
        this.#update();
    }
}
