import {SuperContainer} from "../ObjectFactory";
import gsap from "gsap";

export class Base extends SuperContainer {
    constructor({gameSize}) {
        super();

        this.shadow = this.create.graphics({alpha: 0.5});
        this.shadow.beginFill(0x000000);
        this.shadow.drawRect(0, 0, gameSize.width, gameSize.height);
        this.shadow.endFill();

        this.content = this.create.container({x: gameSize.width / 2, y: gameSize.height * 0.35});
        this.rays = this.content.create.sprite({texture: 'Rays', anchor: {x: 0.5, y: 0.5}, alpha: 0});

        this.baseContainer = this.content.create.container({alpha: 0});

        this.winBase = this.baseContainer.create.sprite({texture: 'WinBase', y: 75, visible: true});
        this.bigWinBase = this.baseContainer.create.sprite({texture: 'BigWinBase', visible: true});
        this.megaWinBase = this.baseContainer.create.sprite({texture: 'MegaWinBase', y: -5, visible: true});

        this.lackWinValue = this.baseContainer.create.text({text: '100', style: 'popupLackWinValue', x: 190, y: 213, anchor: {x: 0.5}});
        this.goldWinValue = this.baseContainer.create.text({text: '100', style: 'popupLackWinValue', x: 190, y: 290, anchor: {x: 0.5}});

        this.baseContainer.create.text({text: '+', style: 'popupLackWinValue', x: 25, y: 213});
        this.baseContainer.create.text({text: '+', style: 'popupLackWinValue', x: 25, y: 290});
        this.baseContainer.pivot.set(this.baseContainer.width / 2, this.baseContainer.height / 2);

        this.winRatio = 2;
        this.bigWinRation = 4;
    }

    showThenHide({win, bet, luck}) {
        const timeline = gsap.timeline();

        this.interactive = true;
        this.buttonMode = true;

        this.once('pointerdown', () =>
            timeline.play('hide')
        );

        timeline
            .add(this.show({luck, win, bet}))
            .addLabel('hide')
            .add(() => {
                this.off('pointerdown');
                this.interactive = false;
            })
            .add(this.hide(), "+=4")


        return timeline;
    }

    setVisibilityBase(win, bet) {
        const ratio = win / bet;
        this.winBase.visible = ratio <= this.winRatio;
        this.bigWinBase.visible = ratio > this.winRatio && ratio <= this.bigWinRation;
        this.megaWinBase.visible = ratio > this.bigWinRation
    }

    show({luck, win, bet}) {
        const timline = gsap.timeline();

        this.setVisibilityBase(win, bet);

        this.lackWinValue.text = luck;
        this.goldWinValue.text = win;

        this.rays.scale.set(0);
        this.baseContainer.scale.set(0);
        this.rays.alpha = 0;
        this.baseContainer.alpha = 0;

        gsap.killTweensOf(this.rays);
        gsap.killTweensOf(this.baseContainer);
        gsap.killTweensOf(this.rays.scale);
        gsap.killTweensOf(this.baseContainer.scale);

        gsap.to(this.rays, {duration: 5, rotation: '+=0.05', repeat: -1, yoyo: true, ease: 'power1.inOut'});

        timline.add([
            gsap.to(this.rays, {duration: 0.2, alpha: 1}),
            gsap.to(this.rays.scale, {x: 1, y: 1, duration: 0.5}),
            gsap.to(this.baseContainer, {duration: 0.2, alpha: 1}),
            gsap.to(this.baseContainer.scale, {x: 1, y: 1, duration: 0.5}),
        ]);

        return timline;
    }

    hide() {
        const timline = gsap.timeline();

        timline.add([
            gsap.to(this.rays, {duration: 0.2, alpha: 0}),
            gsap.to(this.rays.scale, {x: 0, y: 0, duration: 0.2}),
            gsap.to(this.baseContainer, {duration: 0.2, alpha: 0})
        ]);

        return timline;
    }
}
