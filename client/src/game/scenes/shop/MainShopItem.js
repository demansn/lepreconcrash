import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";
import {MainShopItemBuyButton} from "./MainShopItemBuyButton.js";

export class MainShopItem extends SuperContainer {
    constructor({price, label, id, amount}) {
        super();

        this.bg = this.create.displayObject(ElasticBackground, {width: 678, height: 456, style: {fill: 'rgba(0, 0, 0, 0.25)', borderRadius: 24, border: 2, borderColor: 0xffffff}});

        this.price = this.create.object('InlineBlock', {y: 102, params: {lineWidth: 678, horizontalAlign: 'center', verticalAlign: 'middle', gap: 8}});
        this.price.create.text({text: price, style: 'MainShopItemPrice'});
        this.price.create.object('coin-icon', {scale: 1.5});

        this.buyButton = this.create.object('Button', {x: 678 / 2, y: 306 + 9, params: {
                view: new MainShopItemBuyButton({price, label, id, amount})
            }});
    }
}
