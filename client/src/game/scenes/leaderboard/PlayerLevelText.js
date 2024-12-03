import {InlineBlock} from "../../gameObjects/InlineBlock.js";

export class PlayerLevelText extends InlineBlock {
    constructor({luck, luckTarget}) {
        super();

        this.t1 = this.create.text({text: `${luck}/`.toUpperCase(), style: 'PlayerLevelProgressLuck'});
        this.t2 = this.create.text({text: `${luckTarget}`.toUpperCase(), style: 'PlayerLevelProgressLuckTarget'});
    }

    set({luck, luckTarget}) {
        this.t1.text = `${luck}/`.toUpperCase();
        this.t2.text = `${luckTarget}`.toUpperCase();
        this.layout();
    }
}
