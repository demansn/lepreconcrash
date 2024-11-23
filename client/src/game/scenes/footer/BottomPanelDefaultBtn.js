import {SuperContainer} from "../../gameObjects/SuperContainer.js";

export class BottomPanelDefaultBtn extends SuperContainer {
    constructor({icon}) {
        super();
        this.bg = this.create.sprite({texture: 'BottomPanelBtnDefault', anchor: 0.5});
        this.icon = this.create.sprite({texture: `${icon}IconDefault`, anchor: 0.5, y: -15});
        this.text = this.create.text({text: icon.toUpperCase(), style: 'BottomPanelBtnDefaultText', anchor: 0.5, y: 35});
    }
}
