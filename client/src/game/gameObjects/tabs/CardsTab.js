import {SuperContainer} from "../SuperContainer.js";
import {List, ScrollBox} from "@pixi/ui";

export class CardsTab extends SuperContainer {
    constructor({data, height = 900, ...options}) {
        super();

        /*
         * @type {ScrollBox}
         */
        this.list = this.addChild(new List({
            elementsMargin: 16,
            vertPadding: 2,
            horPadding: 4,
            width: 200,
            height: 300,
        }));

        data.forEach(card => this.list.addChild(this.createCard(card, options)));
    }

    createCard(cardData) {
        const TaskCard = cardData.constructor;

        return this.addObject(TaskCard, cardData);
    }

    getHeight() {
        this.list.arrangeChildren();

        return this.list.height;
    }

    updateCard(cardData) {
        const card = this.list.children.find(card => card.id === cardData.id);

        if (!card) {
            return;
        }

        card.update(cardData);
    }

    updateCards(cardsData) {
        cardsData.forEach(cardData => this.updateCard(cardData));
        window.setTimeout(() =>this.resize(), 1);
    }

    addCards(cardsData){
        cardsData.forEach(cardData => {
            const card = this.createCard( {...cardData, onClickClaim: this.onClickClaim, onClickShare: this.onClickShare, onClickInvite: this.onClickInvite, onClickCheck: this.onClickCheck, onClickWatch: this.onClickWatch});

            card.on('changedSize', this.resize.bind(this));

            this.list.addChild(card);
        });

        this.resize();
    }

    resize() {
        this.emit('changedSize');
        this.list.height = this.getHeight();
    }
}
