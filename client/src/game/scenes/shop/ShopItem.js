import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";
import {ShopItemBuyButton} from "./ShopItemBuyButton.js";

export class ShopItem extends SuperContainer {
    constructor(item) {
        super();

        const {price, label, id, amount} = item;

        this.bg = this.create.displayObject(ElasticBackground, {width: 328, height: 186, style: {fill: 'rgba(0, 0, 0, 0.25)', borderRadius: 24, border: 2, borderColor: 0xffffff}});
        this.amount = this.create.text({text: amount, style: 'ShopItemAmount', x: 26, y: 26});
        this.create.object('CoinIcon', {x: this.amount.x + this.amount.width + 8, y: this.amount.y  + this.amount.height, anchor: {x: 0, y: 1}, width: 30, height: 30});
        this.label = this.create.text({text: label, style: 'ShopItemLabel', x: 328 - 26, y: 63, anchor: {x: 1}});

        this.buyButton = this.create.object('Button', {x: 328 / 2, y: 136, params: {
                view: new ShopItemBuyButton({price, label, id, amount})
            }});

        this.buyButton.onPress.connect(() => {
            this.emit('buy', item);
        });
    }
}
