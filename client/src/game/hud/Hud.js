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
            y: 400
        });
        this.roundInfo.on('click', () => {
            console.log('cashOut');
            app.eventEmitter.emit('hud:cashOut:clicked');
        });

        this.nextStepWin = this.create.text({
            text: "+100",
            style: "nextStepWin",
            anchor: 0.5,
            x: GAME_CONFIG.size.width / 2,
            y: GAME_CONFIG.size.height * 0.69
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

    updateRoundInfo(result) {
        this.roundInfo.setValue({
            win: result.win,
            multiplier: result.multiplier,
            luck: result.luck
        });

        this.nextStepWin.text = result.nextStepWin ? `+${result.nextStepWin}` : '';
    }
}
