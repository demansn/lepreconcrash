import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {PlayerLevelText} from "./PlayerLevelText.js";
import {PlayerLevelProgressBar} from "./PlayerLevelProgressBar.js";

export class PlayerLevelProgress extends SuperContainer {
    constructor({luck, luckTarget}) {
        super();

        this.content = this.create.object('InlineBlock', {params: {gap: 4, verticalAlign: 'middle', lineHeight: 30}});

        this.content.create.object(PlayerLevelText, {params: {luck, luckTarget}});
        this.content.create.object('cloverTop', {scale: 0.3})
        this.content.create.object(PlayerLevelProgressBar, {params: {progress: luck / luckTarget * 100}});
    }
}
