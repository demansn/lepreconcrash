import {ObjectFactory, SuperContainer} from "../ObjectFactory";
import {Container} from 'pixi.js';

export class LackPanel extends SuperContainer {
    constructor() {
        super();

        this.bg = this.create.sprite({texture: 'lackPanelBg'});
        this.valueText = this.create.text({text: '1,000,00', style: 'lackPanelValue', x: 150, y:  40, anchor: {x: 0.5, y: 0.5}});
        this.levelText = this.create.text({text: 'LVL 99', style: 'lackPanelLevel', x: 150, y:  90, anchor: {x: 0.5, y: 0.5}});
    }

    setValue(value) {
        this.valueText.text = value;
    }

    setLevel(level) {
        this.levelText.text = `LVL ${level}`;
    }
}
