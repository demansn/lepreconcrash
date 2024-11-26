import {SuperContainer} from "../gameObjects/SuperContainer.js";
import {toFixed} from "../utils.js";

export class LoadingScene extends SuperContainer {
    constructor() {
        super();

        this.create.sprite({texture: 'SplashBG'});
        this.text = this.create.text({anchor: 0.5, x: 's50%', y: 's85%', text: `Loading ${0}%`,style: 'loadingProgress'});

        this.progressBar = this.create.object('ProgressBar', {
            x: 's50%', y: 's90%',
            parameters: {
                bg: 'PreloadProgressBg',
                fill: 'PreloadProgressFill',
                fillPaddings: {top: 11, left: 16},
                progress: 0
            }
        });

        this.progressBar.x -= this.progressBar.width / 2;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    setProgress(progress) {
        const p = toFixed(progress * 100);

        this.text.text = `Loading... ${p}%`;
        this.progressBar.progress = p
    }
}
