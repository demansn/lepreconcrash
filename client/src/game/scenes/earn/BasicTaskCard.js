import {TasksCard} from "./TaskCard.js";
import {CheckBox, Input, List} from "@pixi/ui";
import {TaskStatus} from "../../../../../shared/TaskStatus.js";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {DividerLine} from "../../gameObjects/DividerLine.js";
import {InlineBlock} from "../../gameObjects/InlineBlock.js";

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

        this.descriptionContainer = this.content.create.object('VerticalBlock', {y: 16, parameters: {horizontalAlign: 'center', blockWidth: 630, gap: 16}});
        this.descriptionContainer.addChild(this.createDividerLine(630));
        this.descriptionContainer.addChild(this.createDescription(description));
        this.descriptionContainer.addChild(this.createDividerLine(630));
        this.descriptionContainer.addChild(this.createButtons());
        // this.descriptionContaine.layaout()

        this.descriptionContainer.y = this.toggleDescriptionBtn.y + this.toggleDescriptionBtn.height + 16;

        this.closeDescription();

        this.subscribeButton.button.enabled = task.status === TaskStatus.IN_PROGRESS;
        // this.claimRewardButton.button.enabled = task.status === TaskStatus.READY_TO_CLAIM;
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

        container.create.text({text, style: 'TaskCardDescriptionText'});

        return container;
    }

    createDividerLine(width) {
        const container = new SuperContainer();

        container.create.displayObject(DividerLine,{ parameters: {width: 592}});

        return container;
    }

    createButtons() {
        const container = new InlineBlock({gap: 18});
        const bg = container.create.object('RoundRect', {parameters: {width: 276, height: 72, radius: 20, fill: 0xffffff}});

        const input = new Input({
            bg,
            placeholder: 'Enter text',
            align: 'center',
            textStyle: {
                fontFamily: 'AldotheApache',
                fontSize: 27,
                fontWeight: 400,
                fill: 0x000000,
                align: 'center',
            },
            padding: {
                top: 11,
                right: 11,
                bottom: 11,
                left: 11
            }
        });

        container.addChild(input);

        this.subscribeButton = container.addObject('SubscribeButton');

        return container;
    }
}
