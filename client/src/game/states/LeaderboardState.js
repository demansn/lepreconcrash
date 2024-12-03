import {ScreenState} from "./ScreenState.js";

export class LeaderboardState extends ScreenState {
    enter() {
        super.enter();

        this.screen.on('visitMyProfile', this.onClickVisitMyProfile, this);
        this.updateLeaderboard();
    }

    exit() {
        super.exit();

        this.screen.off('visitMyProfile', this.onClickVisitMyProfile, this);
    }

    onClickVisitMyProfile() {
        this.owner.goTo('MyProfileState');
    }

    async updateLeaderboard() {
        const player = this.logic.player;
        const players = await this.logic.getLeaderBoard();

        this.screen.updateLeaderboard(player, players);
    }
}
