import {BasePopup} from "../BasePopup.js";

export class MessagePopup extends BasePopup{
    init({gameSize}) {
        this.shadow = this.create.graphics({alpha: 0.5});
        this.shadow.beginFill(0x000000);
        this.shadow.drawRect(0, 0, gameSize.width, gameSize.height);
        this.shadow.endFill();

        this.content = this.create.container({x: gameSize.width / 2, y: gameSize.height / 2});
        this.message = this.content.create.text({text: '', style: 'popupTitle', anchor: 0.5});
    }

    show({message}) {
        const timeline = this.gsap.timeline();

        this.message.text = message;

        timeline
            .add(() => {
                this.visible = true;
            })
            .add( this.gsap.to(this.content, {alpha: 1, duration: 0.5}))

        return timeline;
    }

    hide() {
        const timeline =  this.gsap.timeline();

        timeline
            .add(this.gsap.to(this.content, {alpha: 0, duration: 0.5}))
            .add(() => {
                this.visible = false;
            });

        return timeline;
    }
}
