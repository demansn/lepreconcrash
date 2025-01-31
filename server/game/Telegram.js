import {ServiceLocator} from "./ServiceLocator.js";

export class Telegram {
    #botToken;
    #clientURL;
    #onSuccessfulPayment;
    #analytics = ServiceLocator.get('analytics');

    constructor({botToken, clientURL, onSuccessfulPayment}) {
        this.#botToken = botToken;
        this.#clientURL = clientURL;
        this.#onSuccessfulPayment = onSuccessfulPayment;
    }

    async getInvoiceLink({playerID, itemID, item, purchase}) {
        const data = {
            title: item.label,
            description: item.label,
            // todo move to config
            "photo_url": `${this.#clientURL}/assets/icons/ShopItem.png`,
            "photo_width": 150,
            "photo_height": 150,
            payload: JSON.stringify([playerID, itemID, purchase.id]),
            currency: 'XTR',
            prices: JSON.stringify([{amount: item.price, label: item.label}]),
        };
        const params = new URLSearchParams(data).toString();
        const response = await fetch(`https://api.telegram.org/bot${this.#botToken}/createInvoiceLink?${params}`);
        const {result} = await response.json();

        return result;
    }

    async answerPreCheckoutQuery(data) {
        if (data.pre_checkout_query) {
            this.trackUpdate(data);
            const {pre_checkout_query} = data;
            const body = {ok: true, pre_checkout_query_id:pre_checkout_query.id };
            const [_, itemID] = JSON.parse(pre_checkout_query.invoice_payload);
            const response = await fetch(
                `https://api.telegram.org/bot${this.#botToken}/answerPreCheckoutQuery`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                }
            );

            const Logger = ServiceLocator.get('logger');

            Logger.log(`Pre checkout query: ${pre_checkout_query.id} from ${pre_checkout_query.from.id} for buy ${itemID} item for ${pre_checkout_query.total_amount} XTR`);
        }
    }

    async getUserPhoto(url) {
        try {
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const contentType = response.headers.get('content-type');

            return `data:${contentType};base64,${base64}`;
        } catch (error) {
            Logger.error(`Failed to get user photo from url: ${url}, error: ${error}`);
            return '';
        }
    }

    async checkSubscription({playerID, chanel}) {
        const url = `https://api.telegram.org/bot${this.#botToken}/getChatMember?chat_id=${chanel}&user_id=${playerID}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.ok) {
                const status = data.result.status;
                if (status === "member" || status === "administrator" || status === "creator") {
                    return { subscribed: true, status };
                } else {
                    return { subscribed: false, status };
                }
            } else {
                throw new Error(data.description);
            }
        } catch (error) {
            return { subscribed: false, error: error.message };
        }
    }

    async fromTelegram(data) {
        if (data.message) {
            const {message} = data;
            const {successful_payment} = message;

            if (successful_payment) {
                this.trackUpdate(data);
                try {
                    const {invoice_payload, telegram_payment_charge_id, order_info} = successful_payment;

                    const [playerID, itemID, purchaseId] = JSON.parse(invoice_payload);

                    this.#onSuccessfulPayment({playerID, itemID, purchaseId, paymentID: telegram_payment_charge_id})

                } catch(e) {
                    Logger.error(`Failed to process payment: ${e} for data: ${JSON.stringify(data)}`);
                }
            }
        }

        if (data.pre_checkout_query) {
            this.trackUpdate(data);
           return this.answerPreCheckoutQuery(data);
        }

        return true;
    }

    async trackUpdate(data) {
        const {message} = data;
        try {
            if (message && message.from && message.from.id) {
                this.#analytics.getProvider('telemetree').trackUpdate(data);
            }
        } catch (e) {
            Logger.error(`Failed to track update: ${e}`);
        }
    }

}
