import {TasksCard} from "./TaskCard.js";

export class FriendsTaskCard extends TasksCard {
    createContent(task) {
        this.inviteButton = this.content.create.object('InviteButton');

        this.inviteButton.x = 630 - 26 - this.inviteButton.width;
        this.inviteButton.y = 26;

        this.inviteButton.button.onPress.connect(this.onClickInvite.bind(this));
    }
}
