import {ShopItems} from "./shop/ShopItems.js";

export class GameShop {
    /**
     *
     * @param {MongoDBAdapter} db
     * @param botToken
     * @param clientURL
     */
    constructor(db, botToken, clientURL) {
        this.db = db;
        this.botToken = botToken;
        this.clientURL = clientURL;
    }


    async getInvoiceLink(playerID, itemID, totalGames) {
        const item = this.getShopItem(itemID);

        if (!item) {
            return false;
        }

        const purchase = await this.addPurchase({playerID, itemID, totalGames});
        const data = {
            title: item.label,
            description: item.label,
            // todo move to config
            "photo_url": `${this.clientURL}/assets/icons/ShopItem.png`,
            "photo_width": 150,
            "photo_height": 150,
            payload: JSON.stringify([playerID, itemID, purchase.id]),
            currency: 'XTR',
            prices: JSON.stringify([{amount: item.price, label: item.label}]),
        };
        const params = new URLSearchParams(data).toString();
        const response = await fetch(`https://api.telegram.org/bot${this.botToken}/createInvoiceLink?${params}`);
        const {result} = await response.json();

        return result;
    }

    async addPurchase(info) {
        const shopItem = this.getShopItem(info.itemID);

        if (!shopItem) {
            return;
        }

        const purchaseData = {
            ...info,
            amount: shopItem.amount,
            price: shopItem.price,
            currency: 'XTR',
            status: 'created',
            paymentID: null,
        };
        const id = await this.db.addPurchasedItem(purchaseData);

        return {
            id,
            ...purchaseData,
        };
    }

    async confirmPurchase(purchaseID, data) {
        return await this.db.updatePurchase(purchaseID, {status: 'success', ...data});
    }

    getShopItem(id) {
        return ShopItems.find(item => item.id === id);
    }
}
