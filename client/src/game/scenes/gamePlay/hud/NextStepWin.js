import {SuperContainer} from "../../../gameObjects/SuperContainer.js";

export class NextStepWin extends SuperContainer {
    constructor() {
        super();

        this.container = this.create.container({x: 0, y: 0});
        this.valueText = this.container.create.text({text: '+0', style: 'nextStepWin', anchor: {y: 0.5}});
        this.icon = this.container.create.sprite( {texture: 'goldIconCenter', anchor: {y: 0.5}});
    }

    setValue(value) {
        this.valueText.text = `+${value}`;
        this.updateContainerPosition();
    }

    updateContainerPosition() {
        this.icon.x = this.valueText.width + 5;
        this.container.x = -this.container.width / 2;
    }
}
