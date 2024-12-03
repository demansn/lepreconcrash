import {ScreenState} from "./ScreenState.js";

export class LeaderboardState extends ScreenState {
    enter() {
        super.enter();

        this.updateLeaderboard();
    }

    async updateLeaderboard() {
        const player = this.logic.player;
        const players = await this.logic.getLeaderBoard();

        this.screen.updateLeaderboard(player, players);
    }
}
