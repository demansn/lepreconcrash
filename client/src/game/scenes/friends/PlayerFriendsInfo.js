import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ElasticBackground} from "../../gameObjects/ElasticBackground.js";
import {List} from "@pixi/ui";

export class PlayerFriendsInfo extends SuperContainer {
    constructor({activeFriends = 0, earned = 0}) {
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

        this.icon = this.create.object('PlayerIcon', {x: 36, y: 36});
        this.create.displayObject(PlayerName, {name: 'PlayerName', x: this.icon.x + this.icon.width + 24, y: this.icon.y + this.icon.height / 2});

        this.activeFriendsInfo = this.create.displayObject(PlayerFriendsInfoCard, {icon: 'cap', value: activeFriends, label: 'ACTIVE FRIENDS'});
        this.yourEarnedInfo = this.create.displayObject(PlayerFriendsInfoCard, {icon: 'coin-icon', value: earned, label: 'YOUR EARNED'});

        this.create.displayObject(List, {x: 36, y: 156, parameters: {children: [this.activeFriendsInfo, this.yourEarnedInfo], type: 'horizontal', elementsMargin: 18}});
    }

    setValue({activeFriends, earned}) {
        this.activeFriendsInfo.setValue(activeFriends);
        this.yourEarnedInfo.setValue(earned);
    }
}

export class PlayerName extends SuperContainer {
    constructor({name}) {
        super();

        this.name = 'PlayerName'

         const t1 = this.create.text({text: `HI, ${name}`.toUpperCase(), style: 'HiPlayerNameStyle'});

        this.create.text({name: 'visitMyProfile', text: 'VISIT MY PROFILE >', style: 'VisitMyProfileStyle', y: t1.height + 8, alpha: 0.5, interactive: true, buttonMode: true});

         this.pivot.y = this.height / 2;
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
