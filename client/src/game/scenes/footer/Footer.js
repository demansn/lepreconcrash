import {BaseScene} from "../BaseScene.js";
import {BottomPanelBtn} from "./BottomPanelBtn.js";
import {GameConfig} from "../../../configs/gameConfig.js";

export class Footer extends BaseScene {
    constructor() {
        super();

        this.statesIcons = GameConfig.statesIcons;
        this.icons = [];
        this.iconsByState = {};

        for (const [name, {icon, state}] of Object.entries(this.statesIcons)) {
            this.icons.push(icon);
            this.iconsByState[state] = icon;
        }

        this.cloudsFront = this.create.sprite({texture: 'CloudsBack', anchor: {x: 0.5, y: 1}, x: 's50%', y: 's100%'});
        this.buttons =  this.create.object('RadioGroup', {
            x: 85,
            y: 's94%',
            parameters: {
                elementsMargin: 20,
                items: this.icons.map(icon => new BottomPanelBtn({icon}))
            }
        });

        this.buttons.onChange.connect(this.#onSelected.bind(this));

        this.setLayer('hud');
        this.zOrder = 1000;
        this.zIndex = 1000;
    }

    #onSelected(index) {
        const icon = this.icons[index].toLowerCase();

        this.emit('selected', this.statesIcons[icon].state);
    }

    select(state) {
        const icon = this.iconsByState[state];
        const index = this.icons.indexOf(icon);

        if (index === -1 || index === this.buttons.selected) {
            return;
        }
        this.buttons.selected = index;
        this.buttons.selectItem(index);
    }
}
