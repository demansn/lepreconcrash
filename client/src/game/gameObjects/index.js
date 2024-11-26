import {ProgressBar, FancyButton, RadioGroup} from "@pixi/ui";
import {Mather} from "./Mather.js";
import {ClaimButton} from "./ClaimButton.js";
import {ColoredCheckBox, ElasticBackground} from "./ElasticBackground.js";
import {SubscribeButton} from "./SubscribeButton.js";
import {ClaimRewardButton} from "./ClaimRewardButton.js";
import {InviteButton} from "./InviteButton.js";
import {TextWithIcon} from "./TextWithIcon.js";

Mather.registerObjectFactory('ProgressBar', (parameters) => new ProgressBar(parameters));
Mather.registerObjectFactory('FancyButton', (parameters) => new FancyButton(parameters));
Mather.registerObjectFactory('RadioGroup', (parameters) => new RadioGroup(parameters));
Mather.registerObjectFactory('ClaimButton', (parameters) => new ClaimButton(parameters));
Mather.registerObjectFactory('SubscribeButton', (parameters) => new SubscribeButton(parameters));
Mather.registerObjectFactory('ClaimRewardButton', (parameters) => new ClaimRewardButton(parameters));
Mather.registerObjectFactory('InviteButton', (parameters) => new InviteButton(parameters));
Mather.registerObjectFactory('TextWithIcon', (parameters) => new TextWithIcon(parameters));

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
    const items = ['DAILY', 'BASIC', 'FRIENDS'];

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
