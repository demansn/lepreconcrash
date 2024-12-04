import {SuperContainer} from "./SuperContainer.js";
import {FancyButton} from "@pixi/ui";

export class SubscribeButton extends SuperContainer {
    constructor() {
        super();

        this.button = this.create.displayObject(FancyButton, {
            parameters: {
                defaultView: 'claim_button_bg',
                text: this.create.text({text: 'SUBSCRIBE', style: 'ClaimBtnText'}),
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

        this.button.x += this.button.width / 2;
        this.button.y += this.button.height / 2;
    }
}
