import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";

export class MainShopItemBuyButton extends SuperContainer {
    constructor({price, label, id, amount}) {
        super();

        this.bg = this.create.displayObject(ElasticBackground, {width: 410, height: 92, style: {fill: 0xE07904, borderRadius: 20, border: 4, borderColor: '0xffffff'}});
        this.content = this.create.object('InlineBlock', {params: {lineWidth: 410, lineHeight: 92, horizontalAlign: 'center', verticalAlign: 'middle', gap: 38}});

        this.amount = this.content.create.object('InlineBlock', {params: {verticalAlign: 'middle', gap: 9}});

        this.amount.create.text({text: 'BUY FOR', style: 'MainShopItemBuyButton'});
        this.amount.create.object('white-star');
        this.amount.create.text({text: amount, style: 'MainShopItemBuyButton'});

        this.vertialLine = this.content.create.graphics();
        this.vertialLine.lineStyle(2, 0xffffff);
        this.vertialLine.moveTo(0, 0);
        this.vertialLine.lineTo(0, 25);

        this.content.create.text({text: label, style: 'MainShopItemBuyButton'});
    }
}
