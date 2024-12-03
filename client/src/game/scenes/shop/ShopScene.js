import {ScreenScene} from "../ScreenScene.js";
import {List} from "@pixi/ui";
import {MainShopItem} from "./MainShopItem.js";
import {ShopItem} from "./ShopItem.js";

export class ShopScene extends ScreenScene {
    constructor() {
        super({name: 'shop'});

        this.items = this.create.displayObject(List, {x: 21, y: 148, parameters: {topPadding: 1, bottomPadding: 1, elementsMargin: 21}});

        this.isCreated = false;
    }

    addItems(items) {
        if (this.isCreated) {
            return;
        }

        items.forEach(item => {
            const shopItem = item.isMain ? new MainShopItem(item) : new ShopItem(item);

            shopItem.on('buy', (item) => this.emit('buy', item));

            this.items.addChild(shopItem);
        });

        this.isCreated = true;
    }
}
