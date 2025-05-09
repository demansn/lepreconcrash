import {ScreenScene} from "../ScreenScene.js";
import {PlayerLeaderBoardInfo} from "./PlayerLeaderBoardInfo.js";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ScrollBox, Slider} from "@pixi/ui";
import {InlineBlock} from "../../gameObjects/InlineBlock.js";
import {Graphics} from "pixi.js";
import {getPlayerRankLevel, LevelsIcon} from "../../../../../shared/PlayrLevels.js";

export class LeaderboardScene extends ScreenScene {
    constructor() {
        super({name: 'leaderboard'});

        this.playerInfo = this.create.object(PlayerLeaderBoardInfo, {x: 30, y: 100, params: {luck: 0, level: 0}});
        this.list = this.create.object(ScrollBox, {
            x: 21,
            y: 474,
           parameters: {
               proximityDebounce: 0,
               width: 678,
               height: 572,
               elementsMargin: 20,
               items: []
           }
        });

        this.getObjectByName('visitMyProfileButton').on('pointerdown', () => this.emit('visitMyProfile'));

        const bg = new Graphics()
            .beginFill(0x069266)
            .drawRoundedRect(0, 0, 484, 8, 11)
            .endFill()


        const fill = new Graphics()
            .beginFill(0x069266)
            .drawRoundedRect(0, 0, 484, 8, 11)
            .endFill()

        const slider = new Graphics()
            .beginFill(0x0ffffff)
            .drawRoundedRect(-24, -4, 49, 8, 11)
            .endFill()

        const singleSlider = new Slider({
            bg,
            fill,
            slider,
            min: 0,
            max: 100,
            step: 1,
            value: 0,
        });

        singleSlider.y = 515;
        singleSlider.x = 690;
        singleSlider.rotation = Math.PI / 2;

        singleSlider.onUpdate.connect((value) => {
            this.list.scrollToPosition({x: 0, y: (this.list.scrollHeight - this.list.height) / 100 * value});
        });

        this.list.onScroll.connect((scrollY) => {
            singleSlider.value = -scrollY / (this.list.scrollHeight - this.list.height) * 100;
        });

        this.addChild(singleSlider);
    }

    updateLeaderboard(player, players) {
        this.playerInfo.set({luck: player.luck, level: player.level})

        if (this.list) {
            this.list.removeItems();
            this.list.addItems(players.map((player, index) => new PlayerItem(player, index += 1)));
        }
    }
}

class PlayerItem extends SuperContainer {
    constructor({username, luck}, place) {
        super();

        const level = getPlayerRankLevel(luck);

        // this.icon = this.create.object(LevelsIcon[level || 0], {scale: 0.3});
        this.icon = this.create.object('LeaderboardPlayerIcon');
        this.name = this.create.text({x: this.icon.width + 16, y: this.icon.height / 2, anchor: {y: 0.5},text: username, style: 'LeaderboardPlayerItemName'});

        this.create.object(LuckLabel, {parameters: {luck, place}, x: 618, y:  this.icon.height / 2 - 33 / 2, pivot: {x: '%100'}});
    }
}

class LuckLabel extends InlineBlock {
    styleByPlace = {
        1: {fill: 0xFFC100, cup: 'GoldCup', textStyle: 'LeaderboardPlayerItemLuckWhite'},
        2: {fill: 0xA6A6A6, cup: 'SilverCup', textStyle: 'LeaderboardPlayerItemLuckWhite'},
        3: {fill: 0xFF6200, cup: 'BronzeCup', textStyle: 'LeaderboardPlayerItemLuckWhite'},
        'default': {fill: 0xffffff, cup: '', textStyle: 'LeaderboardPlayerItemLuck'},
    }
    constructor({luck, place}) {
        super({verticalAlign: 'middle', gap: 12, horizontalAlign: 'right'});

        const {fill, cup, textStyle} = this.styleByPlace[place] || this.styleByPlace['default'];

        if (cup) {
            this.create.object(cup);
        }

        this.conatiner = this.create.container();

        this.conatiner.create.object('RoundRect', {params: {width: 98, height: 33, fill}});
        this.content = this.conatiner.create.object('InlineBlock', {params: {lineWidth: 98, lineHeight: 33, verticalAlign: 'middle', horizontalAlign: 'center', gap: 4}});
        this.content.create.text({text: luck, style: textStyle});
        this.content.create.object('cloverTop', {scale: 0.2});
        this.content.layout();
        this.layout();
    }
}







