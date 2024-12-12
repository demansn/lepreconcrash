import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";

export class MainShopItemBuyButton extends SuperContainer {
    constructor({price, label, id, amount}) {
        super();

        this.bg = this.create.object('GoldLabelBackground', {y: 0});
        this.content = this.create.object('InlineBlock', {params: {lineWidth: 410, lineHeight: 92, horizontalAlign: 'center', verticalAlign: 'middle', gap: 20}, y:  20});

        this.amount = this.content.create.object('InlineBlock', {params: {verticalAlign: 'middle', gap: 4}});

        const block = this.content.create.object('VerticalBlock', {params: {gap: 5}});

        block.create.text({text: 'BUY FOR', style: 'MainShopItemBuyButton'});

       const priceLine = block.create.object('InlineBlock', {params: {lineWidth: 100, lineHeight: 20, horizontalAlign: 'center', verticalAlign: 'middle', gap: 8}})

        priceLine.create.object('white-star', {tint: 0x3b050f});
        priceLine.create.text({text: price, style: 'MainShopItemBuyButton'});

        this.vertialLine = this.content.create.graphics();
        this.vertialLine.lineStyle(2, 0x3b050f);
        this.vertialLine.moveTo(0, 0);
        this.vertialLine.lineTo(0, 60);

        this.content.create.text({text: label, style: 'MainShopItemBuyButton'});
    }
}
