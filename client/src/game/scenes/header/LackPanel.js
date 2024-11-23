import gsap from "gsap";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";

export class LackPanel extends SuperContainer {
    constructor() {
        super();

        this.bg = this.create.sprite({texture: 'lackPanelBg'});
        this.create.sprite({texture: 'cloverTop',  y: this.bg.height / 2, x: this.bg.width, anchor: {y: 0.5, x: 0.5}});
        this.valueText = this.create.text({text: '1,000,00', style: 'lackPanelValue', x: this.bg.width * 0.5, y:  20, anchor: {x: 0.5, y: 0.5}});
        this.levelText = this.create.text({text: 'LVL 99', style: 'lackPanelLevel', x: this.bg.width * 0.5, y:  45, anchor: {x: 0.5, y: 0.5}});

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
