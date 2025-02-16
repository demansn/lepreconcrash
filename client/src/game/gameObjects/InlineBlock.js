import {SuperContainer} from "./SuperContainer.js";

/**
 * Класс InlineBlock, наследующий SuperContainer, используется для горизонтального расположения дочерних элементов
 * с поддержкой выравнивания и промежутков между ними.
 */
export class InlineBlock extends SuperContainer {
    /**
     * @param {Object} options - Опции для настройки InlineBlock.
     * @param {number|null} [options.lineWidth=null] - Ширина линии. Если не задана, вычисляется автоматически.
     * @param {number|null} [options.lineHeight=null] - Высота линии. Если не задана, вычисляется автоматически.
     * @param {string} [options.horizontalAlign="left"] - Выравнивание по горизонтали: "left", "center", "right".
     * @param {string} [options.verticalAlign="top"] - Выравнивание по вертикали: "top", "middle", "bottom".
     * @param {number} [options.gap=0] - Расстояние между дочерними элементами.
     */
    constructor({ lineWidth, lineHeight, horizontalAlign = "left", verticalAlign = "top", gap = 0 } = {}) {
        super();
        /**
         * Ширина линии. Если не задана, вычисляется автоматически.
         * @type {number|null}
         */
        this.lineWidth = lineWidth;

        /**
         * Высота линии. Если не задана, вычисляется автоматически.
         * @type {number|null}
         */
        this.lineHeight = lineHeight;

        /**
         * Выравнивание по горизонтали: "left", "center", "right".
         * @type {string}
         */
        this.horizontalAlign = horizontalAlign;

        /**
         * Выравнивание по вертикали: "top", "middle", "bottom".
         * @type {string}
         */
        this.verticalAlign = verticalAlign;

        /**
         * Расстояние между дочерними элементами.
         * @type {number}
         */
        this.gap = gap;
    }

    /**
     * Располагает дочерние элементы в линию с учётом выравнивания и промежутков.
     */
    layout() {
        let totalWidth = 0;
        let maxHeight = 0;

        // Определяем ширину линии и максимальную высоту
        this.children.forEach((child, index) => {
            totalWidth += child.width;
            if (index > 0) totalWidth += this.gap;
            if (child.height > maxHeight) maxHeight = child.height;
        });

        const containerWidth = this.lineWidth || totalWidth;
        const containerHeight = this.lineHeight || maxHeight;

        let currentX = 0;

        // Определяем начальную позицию для выравнивания
        if (containerWidth) {
            if (this.horizontalAlign === "center") {
                currentX = (containerWidth - totalWidth) / 2;
            } else if (this.horizontalAlign === "right") {
                currentX = containerWidth - totalWidth;
            }
        }

        // Расположение дочерних элементов
        this.children.forEach(child => {
            let yOffset = 0;

            // Определяем вертикальное выравнивание
            if (containerHeight) {
                if (this.verticalAlign === "middle") {
                    yOffset = (containerHeight - child.height) / 2;
                } else if (this.verticalAlign === "bottom") {
                    yOffset = containerHeight - child.height;
                }
            }

            // Устанавливаем позицию дочернего элемента
            child.x = currentX;
            child.y = yOffset;

            currentX += child.width + this.gap;
        });
    }

    /**
     * Добавляет дочерний элемент и перезапускает выравнивание.
     * @param {Object} child - Дочерний объект.
     */
    addChild(child) {
        super.addChild(child);
        this.layout();
    }

    /**
     * Удаляет дочерний элемент и перезапускает выравнивание.
     * @param {Object} child - Дочерний объект.
     */
    removeChild(child) {
        super.removeChild(child);
        this.layout();
    }
}
