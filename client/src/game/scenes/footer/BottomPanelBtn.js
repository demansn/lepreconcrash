import {CheckBox} from "@pixi/ui";
import {BottomPanelActiveBtn} from "./BottomPanelActiveBtn.js";
import {BottomPanelDefaultBtn} from "./BottomPanelDefaultBtn.js";

export class BottomPanelBtn extends CheckBox {
    constructor({icon}) {
        super({
            style: {
                checked: new BottomPanelActiveBtn({icon}),
                unchecked: new BottomPanelDefaultBtn({icon})
            }
        });
    }
}
