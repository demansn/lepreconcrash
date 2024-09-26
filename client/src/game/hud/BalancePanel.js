import {Container} from "pixi.js";
import {ObjectFactory} from "../ObjectFactory";

export class BalancePanel extends Container {
    constructor() {
        super();

        this.bg = ObjectFactory.createSprite('balancePanelBg');
        this.addChild(this.bg);

        this.valueText = ObjectFactory.createText('0', 'balancePanelValue', {x: 200, y:  this.bg.height / 2, anchor: {y: 0.5}});
        this.addChild(this.valueText);
    }

    setValue(value) {
        this.valueText.text = value;
    }
}
