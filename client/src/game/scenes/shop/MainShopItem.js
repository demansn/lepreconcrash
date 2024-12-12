import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {MainShopItemBuyButton} from "./MainShopItemBuyButton.js";

export class MainShopItem extends SuperContainer {
    constructor(item) {
        super();

        const {price, label, id, amount} = item;

        this.bg = this.create.object('MainItemShop', {anchor: {x: 0.56}, x: 's50%', y: 0});

        this.price = this.create.object('InlineBlock', {y: 30, params: {lineWidth: 678, lineHeight: 230, horizontalAlign: 'center', verticalAlign: 'middle', gap: 8}});
        this.price.create.text({text: amount, style: 'MainShopItemPrice'});
        this.price.create.object('coin-icon', {scale: 2.5});
        this.price.layout();

        this.buyButton = this.create.object('Button', {x: 678 / 2, y: 306 + 9, params: {
                view: new MainShopItemBuyButton({price, label, id, amount})
            }});

        this.buyButton.onPress.connect(() => {
            this.emit('buy', item);
        });
    }
}
