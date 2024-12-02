import {ScreenScene} from "../ScreenScene.js";
import {PlayerLeaderBoardInfo} from "./PlayerLeaderBoardInfo.js";
import {SuperContainer} from "../../gameObjects/SuperContainer.js";
import {ScrollBox, Slider} from "@pixi/ui";
import {InlineBlock} from "../../gameObjects/InlineBlock.js";
import {Graphics} from "pixi.js";

export class LeaderboardScene extends ScreenScene {
    constructor() {
        super({name: 'leaderboard'});

        const levels =[{level: 1, luck: 10}, {level: 2, luck: 20}, {level: 3, luck: 30}, {level: 4, luck: 40}, {level: 5, luck: 50}]
        const player = {
            luck: 11,
            level: 1,
        };
        const players = [
            {name: 'Player 1', luck: 10},
            {name: 'Player 2', luck: 20},
            {name: 'Player 3', luck: 30},
            {name: 'Player 4', luck: 40},
            {name: 'Player 5', luck: 50},
            {name: 'Player 6', luck: 60},
            {name: 'Player 7', luck: 70},
            {name: 'Player 8', luck: 80},
            {name: 'Player 9', luck: 90},
            {name: 'Player 10', luck: 100},
            {name: 'Player 11', luck: 110},
            {name: 'Player 12', luck: 120},
            {name: 'Player 13', luck: 130},
            {name: 'Player 14', luck: 140},
            {name: 'Player 15', luck: 150},
            {name: 'Player 16', luck: 160},
        ];

        this.create.object(PlayerLeaderBoardInfo, {x: 30, y: 100, params: {luck: player.luck, level: player.level, levels}});
        this.list = this.create.object(ScrollBox, {
            x: 21,
            y: 474,
           parameters: {
               proximityDebounce: 0,
               width: 678,
               height: 572,
               elementsMargin: 20,
               items: players.map((player, index) => new PlayerItem(player, index += 1))
           }
        });

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
            console.log(value);
            this.list.scrollToPosition({x: 0, y: (this.list.scrollHeight - this.list.height) / 100 * value});
            // this.list.scrollY = -(this.list.scrollHeight - this.list.height) / 100 * value;
            // this.list.scr
        });

        this.list.onScroll.connect((scrollY) => {
            singleSlider.value = -scrollY / (this.list.scrollHeight - this.list.height) * 100;
            console.log(scrollY);
        });

        this.addChild(singleSlider);
    }
}

class PlayerItem extends SuperContainer {
    constructor({name, luck}, place) {
        super();

        this.icon = this.create.object('LeaderboardPlayerIcon');
        this.name = this.create.text({x: this.icon.width + 16, y: this.icon.height / 2, anchor: {y: 0.5},text: name, style: 'LeaderboardPlayerItemName'});

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







