import {BalancePanel} from "./BalancePanel.js";
import {LackPanel} from "./LackPanel.js";
import {GameConfig} from "../../../configs/gameConfig.js";
import {BaseScene} from "../BaseScene.js";

export class HeaderScene extends BaseScene {
    constructor() {
        super();

        this.setLayer('hud');
        this.zIndex = 1000;
        this.zOrder = 1000;

        this.balance = new BalancePanel();
        this.addChild(this.balance);
        this.balance.x = 20;
        this.balance.y = 20;

        this.lack = new LackPanel();
        this.lack.x = GameConfig.PixiApplication.width - this.lack.width - 20;
        this.lack.y = 20;
        this.addChild(this.lack);
    }

    animateTo({balance, luck, level}) {
        this.balance.animateTo(balance);
        this.lack.animateTo(luck);
        this.lack.setLevel(level);
    }

    set({balance, luck, level}) {
        this.balance.setValue(balance);
        this.lack.setValue(luck);
        this.lack.setLevel(level);
    }

    setBalance(value) {
        this.balance.setValue(value);
    }
}
