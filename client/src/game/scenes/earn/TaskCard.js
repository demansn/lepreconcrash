import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";

export class TasksCard extends SuperContainer {
    constructor({task, margin = 26}) {
        super();

        this.margin = margin;
        const borderColorByStatus = {
            ready_to_claim: 0xFFE20B,
            in_progress: 0xffffff,
            claimed: 0x004600
        }
        const borderColor = borderColorByStatus[task.status] || 0xffffff;

        this.background = this.create.displayObject(ElasticBackground, {
            width: 630,
            height: 206,
            style: {
                fill: 'rgba(0, 0, 0, 0.6)',
                border: 2,
                borderColor,
                borderRadius: 24
            }
        });

        this.content = this.create.container();

        this.info = this.content.create.displayObject(TaskInfo, {
            x: 16, y: 86,
            parameters: task
        });

        this.createContent(task);
        this.resize();
    }

    createContent(task) {

    }

    resize() {
        this.background.setSize({width: 630, height: this.content.height + this.margin * 2});
    }
}

class TextWithIcon extends SuperContainer {
    constructor({text, textStyle, icon, gap = 8}) {
        super();

        this.value = this.create.text({text: text, style: textStyle});
        this.icon = this.create.sprite({texture: icon, });
        this.gap = gap;

        this.icon.y = this.value.height / 2 - this.icon.height / 2;

        this.#update();
    }

    #update() {
        this.icon.x = this.value.width + this.gap;
    }

    setText(value) {
        this.value.text = value;
        this.#update();
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
