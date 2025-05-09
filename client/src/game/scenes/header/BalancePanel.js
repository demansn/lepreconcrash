import gsap from "gsap";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";


export class BalancePanel extends SuperContainer {
    constructor() {
        super();

        this.bg = this.create.sprite({texture: 'balancePanelBg'});
        this.create.sprite({texture: 'balanceIcon',  y: this.bg.height / 2, anchor: {y: 0.5, x: 0.1}});

        this.valueText = this.create.text({text: '0', style: 'balancePanelValue', x: this.bg.width * 0.45, y:  this.bg.height / 2, anchor: {y: 0.5}});
        this.value = 0;

        this.create.object('Green+', {x: this.bg.width-5, y:  5, anchor: 0.5});
    }

    setValue(value) {
        this.value = value;
        this.valueText.text = value;
    }

    animateTo(value) {
        return gsap.to(this, {duration: 0.2, value}).eventCallback('onUpdate', () => {
            this.valueText.text = this.value.toFixed(1);
        });
    }
}
