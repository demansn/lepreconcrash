import {ObjectFactory} from "../ObjectFactory";
import {Container} from 'pixi.js';

export class LackPanel extends Container {
    constructor() {
        super();

        this.bg = ObjectFactory.createSprite('lackPanelBg');
        this.addChild(this.bg);

        this.valueText = ObjectFactory.createText('1,000,00', 'lackPanelValue', {x: 150, y:  40, anchor: {x: 0.5, y: 0.5}});
        this.addChild(this.valueText);

        this.levelText = ObjectFactory.createText('LVL 99', 'lackPanelLevel', {x: 150, y:  90, anchor: {x: 0.5, y: 0.5}});
        this.addChild(this.levelText);
    }

    setValue(value) {
        this.valueText.text = value;
    }

    setLevel(level) {
        this.levelText.text = `LVL ${level}`;
    }
}
