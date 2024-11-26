import { Graphics } from "pixi.js";

export class DividerLine extends Graphics {
    /**
     * Создает разделительную линию.
     * @param {number} width - Ширина линии.
     * @param {number} thickness - Толщина линии.
     * @param {number} color - Цвет линии (в формате 0xRRGGBB).
     * @param {number} alpha - Прозрачность линии (от 0 до 1).
     */
    constructor(parameters) {
        super();
        this.parameters = parameters;

        this.#drawLine();
    }

    #drawLine() {
        const {width, thickness = 2, color = 0xffffff, alpha = 0.5} = this.parameters;
        this.clear();
        this.beginFill(color, alpha);
        this.drawRect(0, 0, width, thickness);
        this.endFill();
    }
}
