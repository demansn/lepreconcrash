import {SuperContainer} from "../SuperContainer.js";
import {CardsTab} from "./CardsTab.js";
import {RadioGroup} from "@pixi/ui";
import {ColoredCheckBox} from "../ElasticBackground.js";

class TabsButtons extends RadioGroup {
    constructor({buttons}) {
        const checkedStyleButton = {
            fill: '0x3DB232',
            border: 2,
            borderColor: 0xffffff,
            borderRadius: 20
        };
        const uncheckedStyleButton = {
            fill: 'rgba(255, 255, 255, 0.01)',
            border: 2,
            borderColor: 0xffffff,
            borderRadius: 20
        };

        super({
            elementsMargin: 16,
            items: buttons.map(label => {
                return new ColoredCheckBox( {
                    label: {text:label, style: 'TasksPanelBtnText'},
                    checked: checkedStyleButton,
                    unchecked: uncheckedStyleButton,
                    width: 182,
                    height: 64
                })
            })
        });
    }
}

export class CardsTabs extends SuperContainer {
    constructor(options) {
        super();

        const {tabsByType, buttons} = options;

        this.options = options;
        this.background = this.create.object('TaskPanelBackground');
        this.buttons =  this.addObject(TabsButtons,  {buttons}, {x: 's50%', y: 24});
        this.buttons.x -= (this.buttons.width / 2) +16;
        this.buttons.onChange.connect(this.onSelect.bind(this))

        this.tabs = this.create.container();
        this.tabsByType = {};

        for (const type in tabsByType) {
            this.tabsByType[type] = this.addTab(tabsByType[type]);
        }

        this.selectTab(0);
        this.isCreatedTabs = false;
        this.selectedTabIndex = 0;
    }

    addCards(cardsByType) {
        for (const type in this.tabsByType) {
            if(cardsByType[type] && cardsByType[type].length > 0) {
                this.tabsByType[type].addCards(cardsByType[type]);
            }
        }
        this.isCreatedTabs = true;
        this.resize();
    }

    updateCards(cardsByType) {
        for (const type in this.tabsByType) {
            if(cardsByType[type] && cardsByType[type].length > 0) {
                this.tabsByType[type].updateCards(cardsByType[type]);
            }
        }
        this.resize();
    }

    addTab(data = [], height = 900) {
        const CardsTabConstructor = this.options.CardsTabConstructor || CardsTab;

        const panel = this.tabs.addObject(CardsTabConstructor, {
            height,
            data,
            ...this.getTabOptions()
        });

        panel.x = 24;
        panel.y = 104;
        panel.visible = false;

        return panel;
    }

    getTabOptions() {
        return {};
    }

    selectTab(index) {
        this.tabs.children.forEach((panel, i) => {
            panel.visible = i === index;
        });

        this.selectedTabIndex = index;

        this.resize();
    }

    resize() {
        const height = Math.min(this.tabs.children[this.selectedTabIndex].getHeight() + 300);

        this.background.setSize({height, width: 678});
    }

    onSelect(i) {
        this.selectTab(i);
    }

    setTabsData(data) {
        if (this.isCreatedTabs) {
            this.updateTasksCards(data);
        } else {
            this.addTasksCards(data);
        }
    }
}
