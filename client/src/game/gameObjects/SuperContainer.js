import {Assets, Container, TextStyle} from "pixi.js";
import {Mather} from "./Mather.js";
import {Styles} from "../../configs/styles.js";
import {Layer} from "@pixi/layers";
import gsap from "gsap";
import {GameConfig} from "../../configs/gameConfig.js";
import {DisplayObjectStateMachine} from "./DisplayObjectStateMachine.js";

const styles = {
    get: (name) =>  new TextStyle(Styles[name] || {})
}

export const layers = {
    popup: new Layer(),
    hud: new Layer(),
    game: new Layer(),
    'none': null,
    forEach(callback) {
        Object.keys(this).forEach(key => {
            if (typeof this[key] === 'function') {
                return;
            }

            callback(this[key], key);
        });
    },
    get: (name) => layers[name]
}

layers.hud.zIndex = 100;
layers.hud.zOrder = 100;

layers.popup.zIndex = 110;
layers.popup.zOrder = 110;

export class SuperContainer extends Container {
    static resourceGetter = (name) => Assets.get(name);
    static stylesGetter = (name) => styles.get(name);
    // static screenSize = GameConfig.PixiApplication;

    constructor() {
        super();

        this.gameSize = {
            width: GameConfig.PixiApplication.width,
            height: GameConfig.PixiApplication.height
        };
        this.create = new Mather(
            this,
            {get: SuperContainer.resourceGetter},
            {get: SuperContainer.stylesGetter},
            layers,
            GameConfig.PixiApplication,
        );
        this.state = new DisplayObjectStateMachine(this);
        this.gsap = gsap;
    }

    setLayer(name) {
        this.parentLayer =  layers.get(name);
    }

    getObjectByName(name) {
        return this.#findObjectByType(name);
    }

    #findObjectByType(name, children = this.children) {
        const object = children.find((child) => child.name === name);

        if (object) {
            return object;
        }

        for (let i = 0; i < children.length; i++) {
            if (children[i].children) {
                const object = this.#findObjectByType(name, children[i].children);
                if (object) {
                    return object;
                }
            }
        }
    }
}
