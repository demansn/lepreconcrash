import {SuperContainer} from "./SuperContainer.js";
import {Graphics} from "pixi.js";

class BorderedFill extends Graphics {
    constructor(parameters) {
        super();
        this.parameters = parameters;
        this.fillByStyle(parameters);
    }

    setSize({width, height}) {
        const { fill, border, borderColor, borderRadius} = this.parameters;

        this.fillByStyle({fill, border, borderColor, borderRadius, width, height});
    }

    fillByStyle({fill, border, borderColor, borderRadius, width, height}) {
        this.clear();
        this.beginFill(fill);
        this.lineStyle(border, borderColor);
        this.drawRoundedRect(0, 0, width -  border, height -  border, borderRadius);
        this.endFill();
    }
}

export class ElasticBackground extends SuperContainer {
    constructor({width, height, style}) {
        super();

        this.background = this.create.displayObject(BorderedFill, {
            parameters: {
                width: width,
                height: height,
                fill: style.fill,
                border: style.border,
                borderColor: style.borderColor,
                borderRadius: style.borderRadius
            }
        });
    }

    setSize(width, height) {
        this.background.setSize(width, height);
    }
}


class ButtonState extends SuperContainer {
    constructor({width, height, style, label}) {
        super();

        this.background = this.create.displayObject(BorderedFill, {
            parameters: {
                width: width,
                height: height,
                fill: style.fill,
                border: style.border,
                borderColor: style.borderColor,
                borderRadius: style.borderRadius
            }
        });

        this.create.text({
            ...label,
            x: width / 2,
            y: height / 2,
            anchor: 0.5,
        });
    }
}


import {CheckBox} from "@pixi/ui";

export class ColoredCheckBox extends CheckBox {
    constructor({label, width, height, checked, unchecked}) {
        super({
            style: {
                checked: new ButtonState({label, width, height, style: checked}),
                unchecked: new ButtonState({label, width, height, style: unchecked})
            }
        });
    }
}
