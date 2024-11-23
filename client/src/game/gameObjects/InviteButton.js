import {SuperContainer} from "./SuperContainer.js";
import {FancyButton} from "@pixi/ui";

export class InviteButton extends SuperContainer {
    constructor() {
        super();

        this.button = this.create.displayObject(FancyButton, {
            parameters: {
                defaultView: 'invite_btn',
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
