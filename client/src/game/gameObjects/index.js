import {ProgressBar, FancyButton, RadioGroup} from "@pixi/ui";
import {Mather} from "./Mather.js";
import {ClaimButton} from "./ClaimButton.js";
import {ColoredCheckBox, ElasticBackground} from "./ElasticBackground.js";
import {SubscribeButton, WatchButton} from "./SubscribeButton.js";
import {ClaimRewardButton} from "./ClaimRewardButton.js";
import {InviteButton} from "./InviteButton.js";
import {TextWithIcon} from "./TextWithIcon.js";
import {InlineBlock} from "./InlineBlock.js";
import {Graphics} from "pixi.js";
import {VerticalBlock} from "./VerticalBlock.js";
import {CheckButtonButton} from "./CheckButton.js";

Mather.registerObjectFactory('ProgressBar', (parameters) => new ProgressBar(parameters));
Mather.registerObjectFactory('FancyButton', (parameters) => new FancyButton(parameters));
Mather.registerObjectFactory('RadioGroup', (parameters) => new RadioGroup(parameters));
Mather.registerObjectFactory('ClaimButton', (parameters) => new ClaimButton(parameters));
Mather.registerObjectFactory('SubscribeButton', (parameters) => new SubscribeButton(parameters));
Mather.registerObjectFactory('WatchButton', (parameters) => new WatchButton(parameters));
Mather.registerObjectFactory('CheckButtonButton', (parameters) => new CheckButtonButton(parameters));
Mather.registerObjectFactory('ClaimRewardButton', (parameters) => new ClaimRewardButton(parameters));
Mather.registerObjectFactory('InviteButton', (parameters) => new InviteButton(parameters));
Mather.registerObjectFactory('TextWithIcon', (parameters) => new TextWithIcon(parameters));

Mather.registerObjectFactory('RoundRect', (parameters) => {
    const {width, height, radius, fill} = parameters;

    const graphics = new Graphics();
    graphics.beginFill(fill);
    graphics.drawRoundedRect(0, 0, width, height, radius);
    graphics.endFill();

    return graphics;
});

Mather.registerObjectFactory('Line', (parameters) => {
    const {size, length, fill} = parameters;

    const graphics = new Graphics();
    graphics.beginFill(fill);
    graphics.drawRect(0, -size, length, size);
    graphics.endFill();

    return graphics;
});

Mather.registerObjectFactory('Button', (parameters) => new FancyButton({
    defaultView: parameters.view,
    anchor: 0.5,
    animations: {
        pressed: {
            props: {
                anchor: 0.5,
                scale: {
                    x: 0.9,
                    y: 0.9,
                }
            },
            duration: 100,
        }
    }
}));

Mather.registerObjectFactory('TaskPanelButtons', () => {
    const checkedStyleButton = {
        fill: '0x3DB232',
        border: 2,
        borderColor: 0xffffff,
        borderRadius: 20
    };
    const uncheckedStyleButton = {
        fill: 'rgba(255, 255, 255, 0.01)',
        border: 2,
        borderColor: 0xffffff,
        borderRadius: 20
    };
    const items = ['QUESTS', 'FRIENDS'];

    return new RadioGroup({
            elementsMargin: 16,
            items: items.map(label => {
                return new ColoredCheckBox( {
                    label: {text:label, style: 'TasksPanelBtnText'},
                    checked: checkedStyleButton,
                    unchecked: uncheckedStyleButton,
                    width: 182,
                    height: 64
                })
            })
    });
});

Mather.registerObjectConstructor('ElasticBackground', ElasticBackground);
Mather.registerObjectConstructor('InlineBlock', InlineBlock);
Mather.registerObjectConstructor('VerticalBlock', VerticalBlock);

Mather.registerObjectFactory('TaskPanelBackground', ({width = 678, height =1} = {}) => {
    return new ElasticBackground({
            width,
            height,
            style: {
                fill: 'rgba(255, 255, 255, 0.6)',
                border: 4,
                borderColor: 0xffffff,
                borderRadius: 36
            }
    });
});


