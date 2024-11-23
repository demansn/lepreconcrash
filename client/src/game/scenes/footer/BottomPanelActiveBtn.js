import {SuperContainer} from "../../gameObjects/SuperContainer.js";

export class BottomPanelActiveBtn extends SuperContainer {
    constructor({icon}) {
        super();
        this.bg = this.create.sprite({texture: 'BottomPanelBtnActive', anchor: 0.5});
        this.icon = this.create.sprite({texture: `${icon}IconActive`, anchor: 0.5, y:  '-35%'});
        this.text = this.create.text({text: icon.toUpperCase(), style: 'BottomPanelBtnActiveText', anchor: 0.5, y: 35});
    }
}
