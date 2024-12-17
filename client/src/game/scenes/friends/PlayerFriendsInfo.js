import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";
import {List} from "@pixi/ui";
import {Graphics} from "pixi.js";

export class PlayerFriendsInfo extends SuperContainer {
    constructor({activeFriends = 0, earned = 0, userName = 'Player'}) {
        super();

        this.bg = this.create.displayObject(ElasticBackground, {
            width: 678,
            height: 322,
            style: {
                fill: 0x3DB232,
                border: 4,
                borderColor: 0xffffff,
                borderRadius: 24
            }
        });

        const bg = this.create.graphics({x: 36, y: 36});
        bg.beginFill(0xffffff);
        bg.drawCircle(100 / 2,   100 / 2,  104 / 2);
        bg.endFill();

        this.icon = this.create.object('PlayerPhoto', {x: 36, y: 36, width: 100, height: 100});



        this.icon.mask = new Graphics();
        this.icon.mask.beginFill(0x000000);
        this.icon.mask.drawCircle(36 + 100 / 2,  36 + 100 / 2,  100 / 2);
        this.icon.mask.endFill();
        this.addChild(this.icon.mask);

        this.userName = this.create.displayObject(PlayerName, {name: userName, x: this.icon.x + this.icon.width + 24, y: this.icon.y + this.icon.height / 2});

        this.activeFriendsInfo = this.create.displayObject(PlayerFriendsInfoCard, {icon: 'cap', value: activeFriends, label: 'ACTIVE FRIENDS'});
        this.yourEarnedInfo = this.create.displayObject(PlayerFriendsInfoCard, {icon: 'coin-icon', value: earned, label: 'YOUR EARNED'});

        this.create.displayObject(List, {x: 36, y: 156, parameters: {children: [this.activeFriendsInfo, this.yourEarnedInfo], type: 'horizontal', elementsMargin: 18}});
    }

    setValue({activeFriends, earned, userName}) {
        this.activeFriendsInfo.setValue(activeFriends);
        this.yourEarnedInfo.setValue(earned);
        this.userName.setValue(userName);
    }
}

export class PlayerName extends SuperContainer {
    constructor({name}) {
        super();

        this.name = 'PlayerName'

         const t1 = this.textValue = this.create.text({text: `HI, ${name}`.toUpperCase(), style: 'HiPlayerNameStyle'});

         this.create.text({name: 'visitMyProfile', text: 'VISIT MY PROFILE >', style: 'VisitMyProfileStyle', y: t1.height + 8, alpha: 0.5, interactive: true, buttonMode: true});

         this.pivot.y = this.height / 2;
    }

    setValue(text) {
        this.textValue.text = `HI, ${text}`.toUpperCase();
    }
}

class PlayerFriendsInfoCard extends SuperContainer {
    constructor({icon, value, label}) {
        super();

        this.create.displayObject(ElasticBackground, {width: 294, height: 130, style: {fill: 0x137B09, borderRadius: 24}});

        this.textValue = this.create.object('TextWithIcon', {parameters: {icon, text: value, textStyle: 'PlayerFriendsInfoCardValue'}, x: 294 / 2, y: 26, pivot: {x: '%50'}});

        this.create.text({text: label, style: 'PlayerFriendsInfoCardLabel', y: this.textValue.y + this.textValue.height + 6, alpha: 0.6, x: 294 / 2, pivot: {x: '%50'}});
    }

    setValue(value) {
        this.textValue.setText(value);
    }
}
