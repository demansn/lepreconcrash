import {ScreenScene} from "../ScreenScene.js";
import {PlayerFriendsInfo} from "./PlayerFriendsInfo.js";
import {FriendsTaskCard} from "../earn/FriendsTaskCard.js";
import {List} from "@pixi/ui";
import {TaskAction} from "../../../../../shared/TaskAction.js";

export class FriendsScene extends ScreenScene {
    constructor() {
        super({name: 'friends'});
    }

    showData({activeFriends, earned, tasks}) {
        if (this.content) {
            this.content.destroy();
        }

        this.content = this.create.container();
        this.create.displayObject(PlayerFriendsInfo, {x: 21, y: 148, parameters: {activeFriends, earned}});

        const items = [
            this.create.displayObject(FriendsTaskCard, {parameters: {onClickInvite:  this.onClickInviteFriend.bind(this), width: 678, height: 174, task: tasks.find(task => task.id === TaskAction.INVITE_FRIEND)}}),
            this.create.displayObject(FriendsTaskCard, { parameters: {onClickInvite:  this.onClickInviteFriend.bind(this), width: 678, height: 174, task: tasks.find(task => task.id === TaskAction.INVITE_FRIEND_PREMIUM) }})
        ];

        this.create.displayObject(List, {x: 21, y: 506, parameters: {items, type: 'vertical', elementsMargin: 18}});

        this.getObjectByName('visitMyProfile').on('pointerdown', this.onClickVisitMyProfile.bind(this));
    }

    onClickVisitMyProfile() {
        this.emit('visitMyProfile');
    }

    onClickInviteFriend() {
        this.emit('inviteFriend');
    }
}
