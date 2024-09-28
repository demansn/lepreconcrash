import {BalancePanel} from "./BalancePanel";
import {LackPanel} from "./LackPanel";
import {GAME_CONFIG} from "../../configs/gameConfig";
import {PlayButton} from "./PlayButton";
import {app} from "../app";
import {SuperContainer} from "../ObjectFactory";
import {RoundWinInfo} from "../RoundWinInfo";

export class Hud extends SuperContainer {
    constructor() {
        super();

        this.balance = new BalancePanel();
        this.addChild(this.balance);
        this.balance.x = 20;
        this.balance.y = 20;

        this.lack = new LackPanel();
        this.lack.x = GAME_CONFIG.size.width - this.lack.width - 20;
        this.lack.y = 20;
        this.addChild(this.lack);

        this.playButton = new PlayButton();
        this.playButton.x = GAME_CONFIG.size.width / 2;
        this.playButton.y = 2050;
        this.addChild(this.playButton);

        this.roundInfo = this.create.displayObject(RoundWinInfo, {
            x: GAME_CONFIG.size.width / 2,
            y: 500
        });
        this.roundInfo.on('click', () => {
            console.log('cashOut');
            app.eventEmitter.emit('hud:cashOut:clicked');
        });
    }

    gotoPlayState() {
        this.playButton.enable();
        this.playButton.toggleToPlay();
        this.roundInfo.disable();
    }

    gotoGoState() {
        this.playButton.enable();
        this.playButton.toggleToGo();
        this.roundInfo.enable();
    }

    gotoWaitState() {
        this.playButton.disable();
        this.roundInfo.disable();
    }

    animateTo({balance, luck, level}) {
        this.balance.animateTo(balance);
        this.lack.animateTo(luck);
        this.lack.setLevel(level);
        return this.roundInfo.animateToZero();
    }

    updateRoundInfo(result) {
        this.roundInfo.setValue({
            win: result.win,
            multiplier: result.multiplier,
            luck: result.luck
        });
    }
}
