import {ScreenScene} from "../ScreenScene.js";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";
import {Graphics} from "pixi.js";

export class MyProfileScene extends ScreenScene {
    constructor() {
        super({name: 'MyProfileBackground'});

        this.profilePhoto= this.create.container({x: 's50%', y: 322});

        const playerPhoto = this.profilePhoto.create.object('PlayerPhoto', {anchor: 0.5, width: 360, height: 360});

        playerPhoto.mask = this.create.graphics({x: 's50%', y: 322})
        playerPhoto.mask.beginFill(0x000000);
        playerPhoto.mask.drawCircle(0, 0, 360  / 2);
        playerPhoto.mask.endFill();

        this.profilePhoto.create.object('ProfilePhotoFrame', {anchor: {x: 0.5, y: 0.5},  scale: 0.5});

        this.content = this.create.object('VerticalBlock', {y: 560, params: {gap: 20, verticalAlign: 'top', horizontalAlign: 'center', blockWidth: 720, blockHeight: 565}});

        this.userName = this.content.create.text({text: 'User Name',  style: 'MyProfileUserName'});

        const cardsLine = this.content.create.object('InlineBlock', {gap: 19});

        this.playerProgressCard = cardsLine.create.object(ProfileInfoLevelCard, {params: {level: 0, luck: 0, onClick: () => this.onClickCheckProgress()}});
        this.playerFriendsCard = cardsLine.create.object(ProfileInfoFriendsCard, {params: {onClick: () => this.onClickInvite()}});

        this.content.create.object(AboutGameLine);

        //
        const buttonsLine = this.content.create.container();
        const gameRulesBtn =  buttonsLine.create.object('Button', {params: {view: new LinkButtonView({label: 'GAME RULES'})}});
        const faqBtn = buttonsLine.create.object('Button', {params: {view: new LinkButtonView({label: 'FAQ'})}});

        gameRulesBtn.x += gameRulesBtn.width / 2;
        faqBtn.x = gameRulesBtn.x + gameRulesBtn.width + 20;
        gameRulesBtn.y = faqBtn.y = 44;

        gameRulesBtn.onPress.connect(() => this.onClickGameRules());
        faqBtn.onPress.connect(() => this.onClickFAQ());

        this.content.layout();
    }

    onClickFAQ() {
        this.emit('faq');
    }

    onClickGameRules() {
        this.emit('gameRules');
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

class AboutGameLine extends SuperContainer {
    constructor() {
        super();

        this.content = this.create.object('InlineBlock', {params: {gap: 3, horizontalAlign: 'left', verticalAlign: 'bottom', lineHeight: 60}});

        this.content.create.text({text: 'ABOUT GAME', style: 'AboutGameLineTitle'});
        this.content.create.object('Line', {params: {fill: 0xffffff, length:324, size: 2}});
    }
}

class LinkButtonView extends SuperContainer {
    constructor({label}) {
        super();
        this.create.object(ElasticBackground, {parameters: {width: 330, height: 88, style: {fill: 'rgba(0, 0, 0, 0.25)', border: 4, borderRadius: 24, borderColor: 0x06F2A4}}, alpha: 0.6});
        this.create.text({text: label, style: 'LinkButtonTitle', anchor: {y: 0.5}, x: 26, y: 44});
        this.create.object('LinkButton', {x: 248, y: 44, anchor: { y: 0.5}});
    }
}

