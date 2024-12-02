import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {PlayerLevelProgress} from "./PlayerLevelProgress.js";

export class PlayerLeaderBoardInfo extends SuperContainer {
    constructor({luck, level, levels}) {
        super({});

        this.icon = this.create.object('PlayerProfileIcon');
        this.content = this.create.object('VerticalBlock', {x: this.icon.width + 21, y: 0 , params: {gap: 22, blockHeight: 214,  'verticalAlign': 'middle'}});

        this.content.create.text({text: 'VISIT MY PROFILE >', style: 'LeaderboardVisitProfile'});
        this.content.create.text({text: `LEVEL ${level}`, style: 'LeaderboardLevelText'});

        this.progress = this.content.create.object(PlayerLevelProgress, {params: {luck, luckTarget: levels[level + 1].luck}});
    }
}
