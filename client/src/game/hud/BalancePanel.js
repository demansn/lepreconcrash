import {ObjectFactory, SuperContainer} from "../ObjectFactory";

export class BalancePanel extends SuperContainer {
    constructor() {
        super();

        this.bg = this.create.sprite({texture: 'balancePanelBg'});
        this.valueText = this.create.text({text: '0', style: 'balancePanelValue', x: 200, y:  this.bg.height / 2, anchor: {y: 0.5}});
    }

    setValue(value) {
        this.valueText.text = value;
    }
}
