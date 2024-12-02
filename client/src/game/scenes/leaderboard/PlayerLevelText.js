import {InlineBlock} from "../../gameObjects/InlineBlock.js";

export class PlayerLevelText extends InlineBlock {
    constructor({luck, luckTarget}) {
        super();

        this.create.text({text: `${luck}/`.toUpperCase(), style: 'PlayerLevelProgressLuck'});
        this.create.text({text: `${luckTarget}`.toUpperCase(), style: 'PlayerLevelProgressLuckTarget'});
    }
}
