import {ScreenState} from "./ScreenState.js";
import {TaskType} from "../../../../shared/TaskType.js";

export class FriendsState extends ScreenState {
    enter() {
        super.enter();

        const data= {
            tasks: [{
                "id": "invite_friend",
                "type": "friends",
                "title": "Invite a friend",
                "description": "Invite a friend to the game and earn rewards.",
                "reward": 100,
                "goal": 1,
                "progress": 0,
                "counted": 1,
                "status": "in_progress",
                "actionRequired": "invite_friend",
                "repeatable": true,
                "createdAt": "2024-11-26T15:45:31.650Z",
                "updatedAt": "2024-11-26T15:45:31.650Z"
            }, {
                "id": "invite_friend_premium",
                "type": "friends",
                "title": "Invite a friend with Telegram Premium",
                "description": "Invite a friend with Telegram Premium for a bigger reward.",
                "reward": 300,
                "goal": 1,
                "progress": 0,
                "counted": 2,
                "status": "in_progress",
                "actionRequired": "invite_friend_premium",
                "repeatable": true,
                "createdAt": "2024-11-26T15:45:31.650Z",
                "updatedAt": "2024-11-26T15:45:31.650Z"
            }]
        }

        let activeFriends = 0;
        let earned = 0;

        data.tasks.forEach(task => {
            if (task.type === TaskType.friends) {
                activeFriends += task.counted
                earned +=  task.counted * task.reward;
            }
        });

        this.screen.showData({activeFriends, earned, tasks: data.tasks});
    }
}
