import {TasksCard} from "./TaskCard.js";
import {CheckBox, Input} from "@pixi/ui";
import {TaskStatus} from "../../../../../shared/TaskStatus.js";
import {DividerLine} from "../../gameObjects/DividerLine.js";
import {InlineBlock} from "../../gameObjects/InlineBlock.js";
import {TaskAction} from "../../../../../shared/TaskAction.js";

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

        const {description, actionRequired} = task;
        const placeholders = {
            [TaskAction.SHARE_EMAIL]: 'Enter your email',
            [TaskAction.SHARE_PHONE]: 'Enter your phone number',
            [TaskAction.SHARE_X_ACCOUNT]: 'Enter your x account',
        };

        this.toggleDescriptionBtn.onCheck.connect(this.onChange.bind(this));

        this.descriptionContainer = this.content.create.object('VerticalBlock', {y: 16, parameters: {horizontalAlign: 'center', blockWidth: 630, gap: 16}});
        this.descriptionContainer.create.object(DividerLine, { parameters: {width: 592}});
        this.descriptionContainer.create.text({text: description, style: 'TaskCardDescriptionText'});
        this.descriptionContainer.create.object(DividerLine, { parameters: {width: 592}});
        this.descriptionContainer.addChild(this.createButtons(placeholders[actionRequired]));

        this.descriptionContainer.y = this.toggleDescriptionBtn.y + this.toggleDescriptionBtn.height + 16;

        this.closeDescription();

        this.subscribeButton.button.onPress.connect(this.onClickSubscribe.bind(this));
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

    onClickSubscribe() {
        this.onClickShare({
            value: this.input.value,
            task: this.task
        })
    }

    openDescription() {
        this.descriptionContainer.visible = true;
        this.resize();
    }

    closeDescription() {
        this.descriptionContainer.visible = false;
        this.resize();
    }

    createButtons(placeholder = 'Enter text') {
        const container = new InlineBlock({gap: 18});
        const bg = container.create.object('RoundRect', {parameters: {width: 276, height: 72, radius: 20, fill: 0xffffff}});

        this.input = new Input({
            bg,
            placeholder,
            align: 'center',
            textStyle: {
                fontFamily: 'AldotheApache',
                fontSize: 24,
                fontWeight: 400,
                fill: 0x000000,
                align: 'center',
            }
        });

        container.addChild(this.input);

        this.subscribeButton = container.addObject('SubscribeButton');

        return container;
    }
}
