import {BasePopup} from "../lib/BasePopup.js";

export class SessionExpired extends BasePopup {
    init({gameSize}) {
        this.shadow = this.create.graphics({alpha: 0.5});
        this.shadow.beginFill(0x000000);
        this.shadow.drawRect(0, 0, gameSize.width, gameSize.height);
        this.shadow.endFill();

        this.content = this.create.container({x: gameSize.width / 2, y: gameSize.height / 2});
        this.content.create.text({text: 'Session expired! \nPlease tap for reconnection!', style: 'popupTitle', anchor: 0.5});
    }

    show({onClick = () => {}}) {
        const timeline = this.gsap.timeline();

        this.interactive = true;
        this.interactiveChildren = true;
        this.on('pointerdown', onClick);

        timeline
            .add(() => {
                this.visible = true;
            })
            .add( this.gsap.to(this.content, {alpha: 1, duration: 0.5}))

        return timeline;
    }

    hide() {
        const timeline =  this.gsap.timeline();

        this.interactive = false;
        this.off('pointerdown');

        timeline
            .add( this.gsap.to(this.content, {alpha: 0, duration: 0.5}))
            .add(() => {
                this.visible = false;
            });

        return timeline;
    }
}
