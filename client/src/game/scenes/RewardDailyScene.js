import {BaseScene} from "./BaseScene.js";
import * as PIXI from "pixi.js";
import {OutlineFilter} from "pixi-filters";

export class RewardDailyScene extends BaseScene {
    static options = {
        name: 'rewardDailyPopup',
        zIndex: 1001,
    };
    constructor(params) {
        super(params);

        this.bg = this.create.graphics({x: 0, y: 0});
        this.bg.beginFill(0x000000, 0.7);
        this.bg.drawRect(0, 0, this.gameSize.width, this.gameSize.height);

        this.create.object('RewardPopupBackground', {y: 's50%', anchor: {y:0.7}});
        this.title = this.create.text({text: 'CLAIM YOUR DAILY REWARD', style: 'RewardPopupTitle', x: 's50%', y: 's38%', anchor: 0.5});


        this.create.object('GoldLabelBackground', {x: 's50%', y: 's53%', anchor: 0.5});

        this.lineReward = this.create.object('InlineBlock', {x: 's50%', y: 's44%', params: {horizontalAlign: 'center', verticalAlign: 'middle', gap: 8, lineHeight: 200}});

        this.reward =  this.lineReward .create.text({text: 0, style: 'RewardPopupValue'});

       const coinIcon =  this.lineReward .create.object('coin-icon', {scale: 1.5});

        coinIcon.filters = [new OutlineFilter(1, 0x3b050f, 1)];

        this.lineReward .layout();
    }

    show({reward, type}) {
        super.show();

        const isDaily = type === 'daily';

        this.title.text = isDaily ? 'CLAIM YOUR DAILY REWARD' : 'CLAIM REWARD'

        this.reward.text = reward;

        this.interactiveChildren = true;
        this.interactive = true;
        this.lineReward.layout();
        this.lineReward.pivot.x = this.lineReward.width / 2;

        this.on('pointerdown', this.onClick.bind(this));
    }

    onClick() {
        this.hide();
    }
}
