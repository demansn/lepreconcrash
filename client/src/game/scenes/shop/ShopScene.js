import {ScreenScene} from "../ScreenScene.js";
import {List} from "@pixi/ui";
import {MainShopItem} from "./MainShopItem.js";
import {ShopItem} from "./ShopItem.js";

export class ShopScene extends ScreenScene {
    constructor() {
        super({name: 'shop'});

        this.items = this.create.displayObject(List, {x: 21, y: 148, parameters: {topPadding: 1, bottomPadding: 1, elementsMargin: 21}});

        this.items.addChild(
            new MainShopItem({price: 200, label: '200 Game', id: 200, amount: 200}),
            new ShopItem({price: 1, amount: 10, label: '1 Game', id: 1}),
            new ShopItem({price: 5, amount: 50, label: '5 Game', id: 5}),
            new ShopItem({price: 10, amount: 100, label: '10 Game', id: 10}),
            new ShopItem({price: 50, amount: 500, label: '50 Game', id: 50}),
        )
    }
}
