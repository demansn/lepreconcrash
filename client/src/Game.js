import {CoreConfig} from "./game/core/CoreConfig.js";
import {Core} from "./game/core/Core.js";
import {GameConfig} from "./configs/gameConfig.js";
import "./game/gameObjects/index.js";

export class Game {
    constructor() {
        console.log('Game started');
        this.core = new Core(CoreConfig);
        this.config = GameConfig;
        this.start();
    }

    async start() {
        await this.core.run(this.config);
    }

    static start() {
        return new Game();
    }

    scale() {
        let ratio =  window.innerHeight / 1280;

        if (720 * ratio > window.innerWidth) {
            ratio = window.innerWidth / 720;
        }

        const element = document.getElementById('root');

        element.style.width = `${720 * ratio}px`;
        element.style.height = `${1280 * ratio}px`;
    }
}
