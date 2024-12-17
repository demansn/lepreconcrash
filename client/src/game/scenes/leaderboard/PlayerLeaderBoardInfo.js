import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {PlayerLevelProgress} from "./PlayerLevelProgress.js";
import {getPlayerRankLevel, LevelsIcon, nextRankTarget} from "../../../../../shared/PlayrLevels.js";
import {Assets} from "pixi.js";

export class PlayerLeaderBoardInfo extends SuperContainer {
    constructor({luck}) {
        super({});

        const level = getPlayerRankLevel(luck);

        this.icon = this.create.object(LevelsIcon[level || 0]);
        this.content = this.create.object('VerticalBlock', {x: this.icon.width + 21, y: 0 , params: {gap: 12, blockHeight: 214,  'verticalAlign': 'middle'}});

        this.content.create.text({name: 'visitMyProfileButton', text: 'VISIT MY PROFILE >', style: 'LeaderboardVisitProfile', interactive: true});
        this.level = this.content.create.text({text: `LEVEL ${level}`, style: 'LeaderboardLevelText'});

        const luckTarget = nextRankTarget(luck);

        this.progress = this.content.create.object(PlayerLevelProgress, {params: {luck, luckTarget}});
    }

    set({luck}) {
        const level = getPlayerRankLevel(luck);

        const luckTarget = nextRankTarget(luck);

        this.icon.texture = Assets.get(LevelsIcon[level || 0]);

        this.level.text = `LEVEL ${level}`;
        this.progress.set({luck, luckTarget});
    }
}
