import {BaseScene} from "./BaseScene.js";

export class RewardDailyScene extends BaseScene {
    static options = {
        name: 'rewardDailyPopup',
        zIndex: 1001,
    };
    constructor(params) {
        super(params);

        this.create.object('RewardPopup');
        this.create.text({text: 'CLAIM YOUR DAILY REWARD', style: 'RewardPopupTitle', x: 's50%', y: 's38%', anchor: 0.5});
        this.reward = this.create.object('TextWithIcon',{
            text: '100', x: 's50%', y: 's53.5%',
            offset: { y: '-50%'},
            parameters:{textStyle: 'RewardPopupValue', icon:  'coin-icon'}
        });
    }

    show({reward}) {
        super.show();

        this.reward.text = reward;

        this.interactiveChildren = true;
        this.interactive = true;

        this.on('pointerdown', this.onClick.bind(this));
    }

    onClick() {
        this.hide();
    }
}
