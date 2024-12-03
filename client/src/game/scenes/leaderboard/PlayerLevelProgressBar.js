import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ProgressBar} from "@pixi/ui";

export class PlayerLevelProgressBar extends SuperContainer {
    constructor({progress}) {
        super();

        this.bg = this.create.object('RoundRect',  {params: {width: 294, height: 16, radius: 21, fill: 0xFFFFFF}});
        this.progressBar = this.create.object(ProgressBar, {x: 6, y: 6, params: {
                bg: this.create.object('RoundRect', {params: {width: 282, height: 4, radius: 34, fill: 0xCEDCE1}}),
                fill: this.create.object('RoundRect', {params: {width: 282, height: 4, radius: 34, fill: 0x3DB232}}),
                progress
            }});
    }

    set(progress) {
        this.progressBar.progress = progress;
    }
}
