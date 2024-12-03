import {ScreenState} from "./ScreenState.js";

export class ShopState extends ScreenState {
    enter() {
        super.enter();
        this.screen.addItems(this.logic.shopItems);
        this.screen.on('buy', this.onClickBuy, this);
    }

    async onClickBuy(item) {
        const result = await this.logic.buyItem(item.id);

        if (result) {
            this.header.setBalance(this.logic.player.balance);
        }
    }

    exit() {
        super.exit();

        this.screen.off('buy', this.onClickBuy, this);
    }
}
