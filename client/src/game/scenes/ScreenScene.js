import {BaseScene} from "./BaseScene.js";

export class ScreenScene extends BaseScene {
    constructor({name}) {
        super();

        this.create.sprite({texture: `${name}_bg`});
    }
}
