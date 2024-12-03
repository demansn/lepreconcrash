import {ScreenScene} from "../ScreenScene.js";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";

export class MyProfileScene extends ScreenScene {
    constructor() {
        super({name: 'MyProfileBackground'});

        this.content = this.create.object('VerticalBlock', {y: 600, params: {gap: 20, verticalAlign: 'top', horizontalAlign: 'center', blockWidth: 720, blockHeight: 565}});

        this.userName = this.content.create.text({text: 'User Name',  style: 'MyProfileUserName'});

        const cardsLine = this.content.create.object('InlineBlock', {gap: 19});

        this.playerProgressCard = cardsLine.create.object(ProfileInfoLevelCard, {params: {level: 0, luck: 0, onClick: () => this.onClickCheckProgress()}});
        this.playerFriendsCard = cardsLine.create.object(ProfileInfoFriendsCard, {params: {onClick: () => this.onClickInvite()}});
        this.content.layout();
    }

    onClickInvite() {
        this.emit('invite');
    }

    onClickCheckProgress() {
        this.emit('checkProgress');
    }

    setData(player) {
        const fullName = player.profile.firstName + ' ' + player.profile.lastName;
        this.userName.text = fullName ||  player.profile.username || 'Unknown';
        this.playerProgressCard.set({level: player.level, luck: player.luck});
        this.content.layout();
    }
}

export class ProfileInfoCard extends SuperContainer {
    constructor(props) {
        super();
        const {buttonLabel, icon, onClick = () => {}} = props;

        this.bg = this.create.object(ElasticBackground, {parameters: {width: 330, height: 178, style: {fill: 0x000000, border: 4, borderRadius: 24, borderColor: 0xFFE20B}}, alpha: 0.6});
        this.icon = this.create.object(icon, {x: 26, y: 26});
        this.button = this.create.object('Button', {x: 26 + 277 / 2, y: 108 + 44 /2, params: {view: new ProfileInfoCardButton({label: buttonLabel})}});
        this.content = this.create.object('VerticalBlock', {x: 101, y: 26, params: {blockWidth: 195, blockHeight: 64, verticalAlign: 'middle', gap: 4}});
        this.button.onPress.connect(onClick);
    }
}

export class ProfileInfoCardButton extends SuperContainer {
    constructor({label}) {
        super();

        this.create.object(ElasticBackground, {parameters: {width: 277, height: 44, style: {fill: 0x3DB232, borderRadius: 19}}});
        this.create.text({text: label, style: 'ProfileInfoCardButton', y: 22, x: 138.5, anchor: {x: 0.5, y: 0.5}});
    }
}

export class ProfileInfoFriendsCard extends ProfileInfoCard {
    constructor(params) {
        super({buttonLabel: 'Invite', icon: 'PostIcon', ...params});

        this.content.create.text({text: 'INVITE FRIENDS', style: 'ProfileInfoFriendsCardTitle'});
        this.content.create.text({text: 'GET MORE GOLD', style: 'ProfileInfoFriendsCardSubTitle', alpha: 0.5});
        this.content.layout();
    }
}

export class ProfileInfoLevelCard extends ProfileInfoCard {
    constructor(params) {
        super({buttonLabel: 'Check Progress', icon: 'CloverIcon', ...params});

        const {level, luck} = params;

        this.levelText = this.content.create.text({text: 'LEVEL ' + level, style: 'ProfileInfoFriendsCardTitle'});
        this.line = this.content.create.object('InlineBlock', {params: {verticalAlign: 'middle',  gap: 4}});
        this.luckText = this.line.create.text({text: luck, style: 'ProfileInfoFriendsCardSubTitle', alpha: 0.5});

        this.line.create.object('CloverIcon', {scale: 0.35});

        this.content.layout();
    }

    set({level, luck}) {
        this.levelText.text = 'LEVEL ' + level;
        this.luckText.text = luck;
        this.line.layout();
        this.content.layout();
    }
}


