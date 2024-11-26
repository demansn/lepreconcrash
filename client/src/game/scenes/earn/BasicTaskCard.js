import {TasksCard} from "./TaskCard.js";
import {CheckBox, List} from "@pixi/ui";
import {TaskStatus} from "../../../../../shared/TaskStatus.js";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {DividerLine} from "../../gameObjects/DividerLine.js";

export class BasicTaskCard extends TasksCard {
    createContent(task) {
        this.toggleDescriptionBtn = this.content.addChild(new CheckBox({
            style: {
                unchecked: `open_description_btn`,
                checked: `close_description_btn`,
            }
        }));

        this.toggleDescriptionBtn.x = 630 - 26 - this.toggleDescriptionBtn.width;
        this.toggleDescriptionBtn.y = 26;

        const {description} = task;

        this.toggleDescriptionBtn.onCheck.connect(this.onChange.bind(this));

        this.descriptionContainer = this.content.create.displayObject(List, {parameters: {type: 'vertical', vertPadding: 16, elementsMargin: 16}});
        this.descriptionContainer.addChild(this.createDividerLine(630));
        this.descriptionContainer.addChild(this.createDescription(description));
        this.descriptionContainer.addChild(this.createDividerLine(630));
        this.descriptionContainer.addChild(this.createButtons());

        this.descriptionContainer.y = this.toggleDescriptionBtn.y + this.toggleDescriptionBtn.height + 16;

        this.closeDescription();

        this.subscribeButton.button.enabled = task.status === TaskStatus.IN_PROGRESS;
        this.claimRewardButton.button.enabled = task.status === TaskStatus.READY_TO_CLAIM;
    }

    onChange(value) {
        if (value) {
            this.openDescription();
        } else {
            this.closeDescription();
        }

        this.emit('changedSize');
    }

    openDescription() {
        this.descriptionContainer.visible = true;
        this.resize();
    }

    closeDescription() {
        this.descriptionContainer.visible = false;
        this.resize();
    }

    createDescription(text, width = 630) {
        const container = new SuperContainer();

        container.create.text({text, style: 'TaskCardDescriptionText', x: width / 2, anchor: {x: 0.5}});

        return container;
    }

    createDividerLine(width) {
        const container = new SuperContainer();

        container.create.displayObject(DividerLine,{x: width / 2 - 592 / 2, parameters: {width: 592}});

        return container;
    }

    createButtons() {
        const container = new SuperContainer();

        this.subscribeButton = container.create.object('SubscribeButton', {x: 18});
        this.claimRewardButton = container.create.object('ClaimRewardButton', {x: 16});

        this.claimRewardButton.x = this.subscribeButton.x + this.subscribeButton.width + 18;

        return container;
    }
}
