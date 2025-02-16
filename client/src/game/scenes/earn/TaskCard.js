import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {TextWithIcon} from "../../gameObjects/TextWithIcon.js";
import {Card} from "../../gameObjects/tabs/Card.js";

export class TasksCard extends Card {
    constructor(parameters) {
        super(parameters);

        const {
            onClickClaim = () => {},
            onClickInvite = () => {},
            onClickShare = () => {},
            onClickCheck = () => {},
            onClickWatch = () => {},
            data,
        } = parameters;

        this.task = data;

        this.onClickClaim = onClickClaim;
        this.onClickInvite = onClickInvite;
        this.onClickShare = onClickShare;
        this.onClickCheck = onClickCheck;
        this.onClickWatch = onClickWatch;
    }

    createInfo(task) {
        if (!this.info) {
            this.info = this.content.addObject(TaskInfo, task, {x: 16, y: 86});
        }
    }

    createContent(task) {
        super.createContent(task);
        this.createInfo(task);
    }

    getBorderColor() {
        const {status} = this.parameters;

        const borderColorByStatus = {
            ready_to_claim: 0xFFE20B,
            in_progress: 0xffffff,
            claimed: 0x004600
        }

        return borderColorByStatus[status] || 0xffffff;
    }
}

class TaskInfo extends SuperContainer {
    constructor({id, title, reward, icon}) {
        super();

        this.icon = this.create.sprite({texture: icon, anchor: {y: 0.5}});
        this.container = this.create.container();

        this.title =  this.container.create.text({text: title, style: 'TaskInfoText'});
        this.rewards = this.container.create.displayObject(TextWithIcon, {y: this.title.height + 16,  parameters: {
                text: reward,
                textStyle: 'TaskInfoText',
                icon: 'CoinIcon',
                iconWidth: 35,
                iconHeight: 35,
            }});

        this.container.x = this.icon.width + 36;
        this.container.y -= this.container.height / 2;
    }
}
