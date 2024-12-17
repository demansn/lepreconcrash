import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {PlayerLevelText} from "./PlayerLevelText.js";
import {PlayerLevelProgressBar} from "./PlayerLevelProgressBar.js";

export class PlayerLevelProgress extends SuperContainer {
    constructor({luck, luckTarget}) {
        super();

        const row = this.create.object('VerticalBlock', {params: {gap:-20}});
        const line  = row.create.object('InlineBlock', {params: {gap: 4, verticalAlign: 'middle', lineHeight: 30}});

        this.levelText = line.create.object(PlayerLevelText, {params: {luck, luckTarget}});
        line.create.object('cloverTop', {scale: 0.3})

        this.progressBar = row.create.object(PlayerLevelProgressBar, {params: {progress: luck / luckTarget * 100}});

        this.content = line;
    }

    set({luck, luckTarget}) {
        this.levelText.set({luck, luckTarget});
        this.progressBar.set(luck / luckTarget * 100);
        this.content.layout();
    }
}
