import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";

export class PriceIcon extends SuperContainer {
    constructor({price}) {
        super();

        this.bg = this.create.displayObject(ElasticBackground, {width: 70, height: 37, style: {fill: 0xffffff, borderRadius: 56}});
        this.content = this.create.object('InlineBlock', {params: {lineWidth: 70, lineHeight: 37, horizontalAlign: 'center', verticalAlign: 'middle', gap: 4}});
        this.content.create.object('star');
        this.content.create.text({text: price, style: 'PriceIconText'});
    }
}
