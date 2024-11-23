import {app} from "../../../app.js";
import {SuperContainer} from "../../../gameObjects/SuperContainer.js";

export class PlayButton extends SuperContainer {
        constructor() {
            super();

            this.create.sprite({texture: 'BoarderButton2', anchor: {x: 0.5, y: 0.5}, y: -4});

            this.playSprite = this.create.sprite({texture: 'playButton', anchor: {x: 0.5, y: 0.5}});
            this.addChild(this.playSprite);

            this.goSprite = this.create.sprite( {texture: 'goButton', anchor: {x: 0.5, y: 0.5}});
            this.addChild(this.goSprite);

            this.create.sprite({texture: 'BoarderButton1', anchor: {x: 0.5, y: 0.5}, y: 28, x: 3});

            this.on('pointerdown', this.onDown, this);
            this.on('pointerup', this.onUp, this);
            this.on('pointerout', this.onOut, this);
            this.on('pointerup', this.onClicked, this);

            this.cursor = 'pointer';

            this.currentState = 'none';

            this.state.add('play', {
                onEnter() {
                    this.playSprite.visible = true;
                    this.goSprite.visible = false;
                }
            });

            this.state.add('go', () => {
                    this.playSprite.visible = false;
                    this.goSprite.visible = true;
            });
        }

        toggleToPlay() {
            this.state.goTo('play');
        }

        toggleToGo() {
            this.state.goTo('go');
        }

        disable() {
            this.playSprite.interactive = false;
            this.playSprite.buttonMode = false;
            this.goSprite.interactive = false;
            this.goSprite.buttonMode = false;
            this.goSprite.tint = 0xB5B5B5;

            this.interactive = false;
            this.buttonMode = false;
        }

        enable() {
            this.playSprite.interactive = true;
            this.playSprite.buttonMode = true;
            this.goSprite.interactive = true;
            this.goSprite.buttonMode = true;
            this.goSprite.tint = 0xffffff;

            this.interactive = true;
            this.buttonMode = true;
        }

        onDown() {
            this.playSprite.scale.set(0.95);
            this.goSprite.scale.set(0.95);
            this.playSprite.y = this.goSprite.y = 10;
        }

        onUp() {
            this.playSprite.scale.set(1);
            this.goSprite.scale.set(1);
            this.playSprite.y = this.goSprite.y = 0;
        }

        onOut() {
            this.playSprite.scale.set(1);
            this.goSprite.scale.set(1);
            this.playSprite.y = this.goSprite.y = 0;
        }

        onClicked() {
            this.emit(`${this.state.current}:clicked`);
        }
}
