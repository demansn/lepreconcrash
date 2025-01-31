import {SuperContainer} from "./SuperContainer.js";

/**
 * Класс VerticalBlock, наследующий SuperContainer, используется для вертикального расположения дочерних элементов
 * с поддержкой выравнивания и промежутков между ними.
 */
export class VerticalBlock extends SuperContainer {
    /**
     * @param {Object} options - Опции для настройки VerticalBlock.
     * @param {number|null} [options.blockWidth=null] - Ширина блока. Если не задана, вычисляется автоматически.
     * @param {number|null} [options.blockHeight=null] - Высота блока. Если не задана, вычисляется автоматически.
     * @param {string} [options.horizontalAlign="left"] - Выравнивание по горизонтали: "left", "center", "right".
     * @param {string} [options.verticalAlign="top"] - Выравнивание по вертикали: "top", "middle", "bottom".
     * @param {number} [options.gap=0] - Расстояние между дочерними элементами.
     */
    constructor({ blockWidth = null, blockHeight = null, horizontalAlign = "left", verticalAlign = "top", gap = 0, pivotAlign = [] } = {}) {
        super();
        /**
         * Ширина блока. Если не задана, вычисляется автоматически.
         * @type {number|null}
         */
        this.blockWidth = blockWidth;

        /**
         * Высота блока. Если не задана, вычисляется автоматически.
         * @type {number|null}
         */
        this.blockHeight = blockHeight;

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

        this.pivotAlign = pivotAlign;

        /**
         * Вычисленная ширина содержимого контейнера.
         * @type {number}
         */
        this.calculatedWidth = 0;

        /**
         * Вычисленная высота содержимого контейнера.
         * @type {number}
         */
        this.calculatedHeight = 0;
    }

    /**
     * Располагает дочерние элементы в столбец с учётом выравнивания и промежутков.
     */
    layout() {
        let totalHeight = 0;
        let maxWidth = 0;

        // Определяем высоту столбца и максимальную ширину
        this.children.forEach((child, index) => {
            if (child.visible === false) return;
            totalHeight += child.height;
            if (index > 0) totalHeight += this.gap;
            if (child.width > maxWidth) maxWidth = child.width;
        });

        const calculatedBlockWidth = this.blockWidth || maxWidth;
        const calculatedBlockHeight = this.blockHeight || totalHeight;

        let currentY = 0;

        // Определяем начальную позицию для вертикального выравнивания
        if (this.blockHeight) {
            if (this.verticalAlign === "middle") {
                currentY = (calculatedBlockHeight - totalHeight) / 2;
            } else if (this.verticalAlign === "bottom") {
                currentY = calculatedBlockHeight - totalHeight;
            }
        }

        // Расположение дочерних элементов
        this.children.forEach(child => {
            if (child.visible === false) return;
            let xOffset = 0;

            // Определяем горизонтальное выравнивание
            if (this.blockWidth) {
                if (this.horizontalAlign === "center") {
                    xOffset = (calculatedBlockWidth - child.width) / 2;
                } else if (this.horizontalAlign === "right") {
                    xOffset = calculatedBlockWidth - child.width;
                }
            }

            // Устанавливаем позицию дочернего элемента
            child.x = xOffset;
            child.y = currentY;

            // Смещаем Y для следующего элемента
            currentY += child.height + this.gap;
        });

        if (this.pivotAlign.length) {
            const [horizontal, vertical] = this.pivotAlign;

            if (horizontal === 'center') {
                this.pivot.x = this.width / 2;
            } else if (horizontal === 'right') {
                this.pivot.x =  this.width;
            } else {
                this.pivot.x = 0;
            }

            if (vertical === 'middle') {
                this.pivot.y =  this.height / 2;
            } else if (vertical === 'bottom') {
                this.pivot.y = this.height;
            } else {
                this.pivot.y = 0;
            }
        }

        // Обновляем вычисленные размеры
        this.calculatedWidth = maxWidth;
        this.calculatedHeight = totalHeight;
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
