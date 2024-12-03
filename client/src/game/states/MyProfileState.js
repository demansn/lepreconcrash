import {ScreenState} from "./ScreenState.js";

export class MyProfileState extends ScreenState {
    enter() {
        super.enter();

         this.screen.on('invite', this.onClickInvite, this);
         this.screen.on('checkProgress', this.onClickCheckProgress, this);

        this.setScreenData();
    }

    onClickInvite() {
        this.owner.goTo('FriendsState')
    }

    onClickCheckProgress() {
        this.owner.goTo('LeaderboardState');
    }

    exit() {
        super.exit();
        this.screen.off('invite', this.onClickInvite, this);
        this.screen.off('checkProgress', this.onClickCheck, this);
    }

    async setScreenData() {
        this.screen.setData(this.logic.player);
    }
}
