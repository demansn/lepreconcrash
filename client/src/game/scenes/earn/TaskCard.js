import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";
import {TextWithIcon} from "../../gameObjects/TextWithIcon.js";

export class TasksCard extends SuperContainer {
    constructor({task, margin = 26, onClickClaim = () => {}, onClickInvite = () => {}, width = 630, height = 206}) {
        super();

        this.options = {task, margin, onClickClaim, onClickInvite, width, height};

        this.name = 'TasksCard_' + task.id;
        this.task = task;
        this.onClickClaim = onClickClaim;
        this.onClickInvite = onClickInvite;

        this.margin = margin;
        const borderColorByStatus = {
            ready_to_claim: 0xFFE20B,
            in_progress: 0xffffff,
            claimed: 0x004600
        }
        const borderColor = borderColorByStatus[task.status] || 0xffffff;

        this.background = this.create.displayObject(ElasticBackground, {
            width,
            height,
            style: {
                fill: 'rgba(0, 0, 0, 0.6)',
                border: 2,
                borderColor: this.getBorerColorByStatus(task.status),
                borderRadius: 24
            }
        });

        this.content = this.create.container();

        this.createInfo(task);
        this.createContent(task);
        this.resize();
    }

    createInfo(task) {
        this.info = this.content.create.displayObject(TaskInfo, {x: 16, y: 86, parameters: task});
    }

    createContent(task) {}

    resize() {
        this.background.setSize({width: this.options.width, height: this.content.height + this.margin * 2});
    }

    getBorerColorByStatus(status) {
        const borderColorByStatus = {
            ready_to_claim: 0xFFE20B,
            in_progress: 0xffffff,
            claimed: 0x004600
        }

        return borderColorByStatus[status] || 0xffffff;
    }

    update(task) {
        console.log('update', task);
        this.background.setStyle({borderColor: this.getBorerColorByStatus(task.status)});
        this.content.removeChildren();

        this.createInfo(task);
        this.createContent(task);
        this.resize();
    }
}

class TaskInfo extends SuperContainer {
    constructor({id, title, reward}) {
        super();

        this.icon = this.create.sprite({texture: `${id}_icon`, anchor: {y: 0.5}});
        this.container = this.create.container();

        this.title =  this.container.create.text({text: title, style: 'TaskInfoText'});
        this.rewards = this.container.create.displayObject(TextWithIcon, {y: this.title.height + 16,  parameters: {
                text: reward,
                textStyle: 'TaskInfoText',
                icon: 'coin-icon'
            }});

        this.container.x = this.icon.width + 36;
        this.container.y -= this.container.height / 2;
    }
}
