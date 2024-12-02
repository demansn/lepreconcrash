import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";
import {PriceIcon} from "./PriceIcon.js";

export class ShopItemBuyButton extends SuperContainer {
    constructor({price, label, id, amount}) {
        super();

        this.bg = this.create.displayObject(ElasticBackground, {width: 276, height: 57, style: {fill: 0x3DB232, borderRadius: 19, border: 2}});
        this.content = this.create.object('InlineBlock', {params: {lineWidth: 276, lineHeight: 57, horizontalAlign: 'center', verticalAlign: 'middle', gap: 16}});
        this.content.create.text({text: 'BUY FOR', style: 'ShopItemBuyButtonLabel'});
        this.content.addChild(new PriceIcon({price}));
    }
}
