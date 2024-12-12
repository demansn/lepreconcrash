import {ScreenScene} from "../ScreenScene.js";
import {PlayerFriendsInfo} from "./PlayerFriendsInfo.js";
import {FriendsTaskCard} from "../earn/FriendsTaskCard.js";
import {List} from "@pixi/ui";
import {TaskAction} from "../../../../../shared/TaskAction.js";

export class FriendsScene extends ScreenScene {
    constructor() {
        super({name: 'friends'});

        this.content = this.create.container();
        this.playerInfo = this.create.displayObject(PlayerFriendsInfo, {x: 21, y: 148, parameters: {activeFriends: 0, earned: 0, userName: 'PlayerName'}});
        this.getObjectByName('visitMyProfile').on('pointerdown', this.onClickVisitMyProfile.bind(this));
    }

    showData({activeFriends, earned, tasks, userName}) {
        this.playerInfo.setValue({activeFriends, earned, userName});

        if (!this.tasksList) {
            const items = [
                this.create.displayObject(FriendsTaskCard, {parameters: {onClickInvite:  this.onClickInviteFriend.bind(this), width: 678, height: 174, task: tasks.find(task => task.id === TaskAction.INVITE_FRIEND)}}),
                this.create.displayObject(FriendsTaskCard, { parameters: {onClickInvite:  this.onClickInviteFriend.bind(this), width: 678, height: 174, task: tasks.find(task => task.id === TaskAction.INVITE_FRIEND_PREMIUM) }})
            ];

            this.tasksList = this.create.displayObject(List, {x: 21, y: 506, parameters: {items, type: 'vertical', elementsMargin: 18}});
        }
    }

    onClickVisitMyProfile() {
        this.emit('visitMyProfile');
    }

    onClickInviteFriend() {
        this.emit('inviteFriend');
    }
}
