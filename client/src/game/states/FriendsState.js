import {ScreenState} from "./ScreenState.js";
import {TaskType} from "../../../../shared/TaskType.js";

export class FriendsState extends ScreenState {
    enter() {
        super.enter();

        this.screen.on('visitMyProfile', this.onClickVisitMyProfile, this);
        this.screen.on('inviteFriend', this.onClickInviteFriend, this);
        this.updateScreen();
    }

    exit() {
        super.exit();

        this.screen.off('visitMyProfile', this.onClickVisitMyProfile, this);
        this.screen.off('inviteFriend', this.onClickInviteFriend, this);
    }

    async updateScreen() {
        const tasks = await this.logic.getTasks();
        const friendsTasks = tasks.filter(task => task.type === TaskType.friends);

        let activeFriends = 0;
        let earned = 0;

        friendsTasks.forEach(task => {
            if (task.type === TaskType.friends) {
                activeFriends += task.counted
                earned +=  task.counted * task.reward;
            }
        });

        this.screen.showData({activeFriends, earned, tasks: friendsTasks});
    }

    onClickVisitMyProfile() {
        this.owner.goTo('MyProfileState');
    }

    onClickInviteFriend() {
        this.logic.inviteFriend();
    }
}
