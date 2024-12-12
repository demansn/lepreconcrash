import {SuperContainer} from "../gameObjects/SuperContainer.js";
import {CheckBox} from "@pixi/ui";

class OnboardingPage extends SuperContainer {
    constructor(bg) {
        super();

        this.bg = this.create.object(bg);
    }
}

class OnboardingPage1 extends OnboardingPage {
    constructor({onNext}) {
        super('OnboardingPage-1');

        const btn = this.create.object('RoundRect', {x: 's30%', y: 's70%', params: { width: 300, height: 150, radius: 20, fill: 0x000000},alpha: 0.01, interactive: true});

        btn.on('pointerdown', () => {
            onNext();
        });
    }
}

class OnboardingPage2 extends OnboardingPage {
    constructor({onNext}) {
        super('OnboardingPage-2');
        const btn = this.create.object('RoundRect', {x: 's30%', y: 's70%', params: { width: 300, height: 150, radius: 20, fill: 0x000000},alpha: 0.01, interactive: true});

        btn.on('pointerdown', () => {
            onNext();
        });

        let btn2 = this.create.object('RoundRect', {x: 's28%', y: 's12%', params: { width: 300, height: 300, radius: 20, fill: 0x000000},alpha:0.01, interactive: true});

        btn2.on('pointerdown', () => {
            onNext();
        });
    }
}

class OnboardingPage3 extends OnboardingPage {
    constructor() {
        super('OnboardingPage-3');
    }
}


export class OnboardingScene extends SuperContainer {
    constructor() {
        super();

        const pages = [OnboardingPage1, OnboardingPage2, OnboardingPage3];
        this.pages = [];

        for (let i = 0; i < pages.length; i++) {
            this.pages.push(this.create.displayObject(pages[i],{visible: false, onNext: () => this.nextPage(), onPrev: () => this.previousPage()}));
        }

        const PrevNextButtonOptions = {
            defaultView: `PrevBtn`,
            anchor: 0.5,
            animations: {
                pressed: {
                    props: {
                        anchor: 0.5,
                        scale: {
                            x: 0.9,
                            y: 0.9,
                        }
                    },
                    duration: 100,
                }
            }
        };

        this.nextButton = this.create.object('FancyButton', {
        x: 's85%',
        y: 's93%',
            scale: {x: -1},
            parameters: PrevNextButtonOptions
    });

        this.prevButton = this.create.object('FancyButton', {
            x: 's15%',
            y: 's93%',
            parameters: PrevNextButtonOptions
        });

        this.playBtn = this.create.object('FancyButton', {
            x: 's80%',
            y: 's93%',
            parameters: {
                defaultView: `PlayBtnBg`,
                text: this.create.text({text: 'Play', style: 'PlayBtnText'}),
                anchor: 0.5,
                animations: {
                    pressed: {
                        props: {
                            anchor: 0.5,
                            scale: {
                                x: 0.9,
                                y: 0.9,
                            }
                        },
                        duration: 100,
                    }
                }
            }
        });

        this.groupSelection = this.create.object('RadioGroup', {
            y: 's91.5%',
            x: 's50%',
            parameters: {
            elementsMargin: 20,
            items: [
                new CheckBox({
                    style: {
                        unchecked: `RadioUnselected`,
                        checked: `RadioSelected`,
                    }
                }),
                new CheckBox({
                    style: {
                        unchecked: `RadioUnselected`,
                        checked: `RadioSelected`,
                    }
                }),
                new CheckBox({
                    style: {
                        unchecked: `RadioUnselected`,
                        checked: `RadioSelected`,
                    }
                }),
            ],
            type: 'horizontal'
        }
        });

        this.addChild(this.groupSelection);
        this.groupSelection.x -= this.groupSelection.width / 2;

        this.nextButton.onPress.connect(() => this.nextPage());
        this.prevButton.onPress.connect(() => this.previousPage());
        this.playBtn.onPress.connect(() => {
            this.emit('play');
        });

        this.groupSelection.onChange.connect((index) => {
            this.#showPage(index);
        });

        this.current = -1;
        this.#showPage(0);

        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    #showPage(page) {
        if (page === this.current) {
            return;
        }

        this.current = page < 0 ? 0 : page > this.pages.length - 1 ? this.pages.length - 1 : page;
        this.nextButton.visible = this.current < this.pages.length - 1;
        this.prevButton.visible = this.current > 0;
        this.playBtn.visible = this.current === this.pages.length - 1;

        if (this.groupSelection.selected !== this.current) {
            this.groupSelection.selectItem(this.current);
        }

        this.pages.forEach((p, i) => {
            p.visible = i === this.current;
        });
    }

    nextPage() {
        this.#showPage(this.current + 1);
    }

    previousPage() {
        this.#showPage(this.current - 1);
    }
}
