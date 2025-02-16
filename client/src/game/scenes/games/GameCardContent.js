import {VerticalBlock} from "../../gameObjects/VerticalBlock.js";
import {PlayButton} from "../../gameObjects/PlayButton.js";

export class GameCardContent extends VerticalBlock {
    constructor({id, title, icon, onClick}) {
        super({gap: 20, verticalAlign: 'middle'});

        this.line = this.addObject('InlineBlock', {verticalAlign: 'middle',  gap:50});

        this.icon = this.line.addObject(icon);
        this.title =  this.line.create.text({text: title, style: 'TaskInfoText'});

        this.playButton = this.addObject(PlayButton);
        this.playButton.button.onPress.connect(() => {
            onClick(id);
        });
    }
}
