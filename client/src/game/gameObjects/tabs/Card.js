import {SuperContainer} from "../SuperContainer.js";
import {ElasticBackground} from "../ElasticBackground.js";

export class Card extends SuperContainer {
    constructor(parameters) {
        super();

        const {margin =26, id = 'super', width = 630, height = 200} = parameters;

        this.parameters = parameters;
        this.name = 'Card_' + id;
        this.margin = margin;

        this.background = this.create.displayObject(ElasticBackground, {
            width,
            height,
            style: {
                fill: 'rgba(0, 0, 0, 0.6)',
                border: 2,
                borderColor: this.getBorderColor(),
                borderRadius: 24
            }
        });

        this.content = this.create.container();
        this.createContent(parameters);
        this.resize();
    }

    getBorderColor() {
        return 0xffffff;
    }

    createContent(data) {
    }

    update(data) {
        this.background.setStyle({borderColor: this.getBorderColor});
        this.content.removeChildren();
        this.createContent(data);
        this.resize();
    }

    resize() {
        this.background.setSize({width: this.width || 630, height: this.content.height + (26 * 2) });
    }
}
