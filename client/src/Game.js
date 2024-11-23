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
}
