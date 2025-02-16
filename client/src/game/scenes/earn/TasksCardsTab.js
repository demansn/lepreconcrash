import {CardsTab} from "../../gameObjects/tabs/CardsTab.js";

export class TasksCardsTab extends CardsTab {
    constructor(parameters) {
        super(parameters);
        const {onClickClaim, onClickShare, onClickInvite, onClickCheck, onClickWatch} = parameters;

        this.onClickClaim = onClickClaim;
        this.onClickShare = onClickShare;
        this.onClickInvite = onClickInvite;
        this.onClickCheck = onClickCheck;
        this.onClickWatch = onClickWatch;
    }
}
