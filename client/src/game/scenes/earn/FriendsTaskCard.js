import {TasksCard} from "./TaskCard.js";

export class FriendsTaskCard extends TasksCard {
    createContent(task) {
        super.createContent(task);
        this.inviteButton = this.content.create.object('InviteButton');

        this.inviteButton.x = this.background.width - 26 - this.inviteButton.width;
        this.inviteButton.y = 26;

        this.inviteButton.button.onPress.connect(this.parameters.onClickInvite.bind(this));
    }
}
