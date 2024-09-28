import {SuperContainer} from "../ObjectFactory";
import gsap from "gsap";

export class LackPanel extends SuperContainer {
    constructor() {
        super();

        this.bg = this.create.sprite({texture: 'lackPanelBg'});
        this.valueText = this.create.text({text: '1,000,00', style: 'lackPanelValue', x: 150, y:  40, anchor: {x: 0.5, y: 0.5}});
        this.levelText = this.create.text({text: 'LVL 99', style: 'lackPanelLevel', x: 150, y:  90, anchor: {x: 0.5, y: 0.5}});

        this.value = 0;
    }

    setValue(value) {
        this.value = value;
        this.valueText.text = value;
    }

    setLevel(level) {
        this.levelText.text = `LVL ${level}`;
    }

    animateTo(value) {
        return gsap.to(this, {duration: 0.2, value}).eventCallback('onUpdate', () => {
            this.valueText.text = Math.round(this.value);
        });
    }
}
