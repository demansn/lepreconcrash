import {TasksCard} from "./TaskCard.js";
import {TaskStatus} from "../../../../../shared/TaskStatus.js";
import {CheckBox, List} from "@pixi/ui";

export class FriendsTaskCard extends TasksCard {
    createContent(task) {
        this.inviteButton = this.content.create.object('InviteButton');

        this.inviteButton.x = 630 - 26 - this.inviteButton.width;
        this.inviteButton.y = 26;
    }
}

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

import { Graphics } from "pixi.js";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {InviteButton} from "../../gameObjects/InviteButton.js";

export class DividerLine extends Graphics {
    /**
     * Создает разделительную линию.
     * @param {number} width - Ширина линии.
     * @param {number} thickness - Толщина линии.
     * @param {number} color - Цвет линии (в формате 0xRRGGBB).
     * @param {number} alpha - Прозрачность линии (от 0 до 1).
     */
    constructor(parameters) {
        super();
        this.parameters = parameters;

        this.#drawLine();
    }

    #drawLine() {
        const {width, thickness = 2, color = 0xffffff, alpha = 0.5} = this.parameters;
        this.clear();
        this.beginFill(color, alpha);
        this.drawRect(0, 0, width, thickness);
        this.endFill();
    }
}


export class DailyTaskCard extends TasksCard {
    createContent(task) {
        const {goal, progress} = task;
        const left = goal - progress;

        this.status = this.content.create.text({text: ``, style: 'TaskInfoText', y: this.info.y, x: 442 - 26, anchor: {x: 1}});

        switch (task.status) {
            case TaskStatus.IN_PROGRESS:
                this.status.text = `${left} LEFT`;
                this.progressBar = this.content.create.object('ProgressBar', {
                    x: 26, y: 206 - 46,
                    parameters: {
                        bg: 'task_progress_bg',
                        fill: 'task_progress_fill',
                        fillPaddings: {top: 4, left: 4},
                        progress: progress / goal * 100,
                    }
                });
                break;
            case TaskStatus.READY_TO_CLAIM:
                this.status.text = '';
                this.claimButton = this.content.create.object('ClaimButton', {x: 26, y: 206 - 46});
                break;
            case TaskStatus.CLAIMED:
                this.status.text = 'CLAIMED';
                this.background.alpha = 0.5;
                this.info.alpha = 0.5;
                break;
        }
    }
}

