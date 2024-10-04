import {Sprite, Assets, Text, TextStyle, Container, AnimatedSprite} from 'pixi.js';
import {Styles} from "../configs/styles";
import {Layer} from "@pixi/layers";
import {GAME_CONFIG} from "../configs/gameConfig";

export const layers = {
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


const styles = {
    get: (name) =>  new TextStyle(Styles[name] || {})
}

export class DisplayObjectStateMachine {
    constructor(owner) {
        this.owner = owner;
        this.states = {};
        this.current = null;
    }

    add(name, state) {
        this.states[name] = state;
    }

    goTo(name) {
        if (this.current && this.states[this.current].onExit) {
            this.states[this.current].onExit.apply(this.owner);
        }

        this.current = name;

        if (typeof this.states[name] === 'function') {
            this.states[name].apply(this.owner);
        } else {
            this.states[name].onEnter.apply(this.owner);
        }
    }
}

export class SuperContainer extends Container {
    constructor() {
        super();

        this.create = new DisplayObjectsFactory(this, Assets, styles, layers);
        this.state = new DisplayObjectStateMachine(this)
    }
}

export class DisplayObjectsFactory {
    constructor(parent, textures, styles, layers) {
        this.parent = parent;
        this.textures= textures;
        this.styles= styles;
        this.layers = layers;
    }

    setDisplayObjectProperties(displayObject, properties = {}) {
        const {x = 0, y = 0, anchor, layer, ...other} = properties;

        if (typeof x === 'string') {
            const [_, sign, value, percent] = /([-+s]?)(\d+)(%?)/.exec(x);
            let newX = 0;

            if (sign === 's') {
                newX = value * (GAME_CONFIG.size.width / 100);
            } else {
                const offset = percent ? displayObject.width * parseFloat(value) / 100 : parseFloat(value);
                newX = sign === '-' ? -offset : offset;
            }

            displayObject.x = newX;
        } else {
            displayObject.x = x;
        }

        if (typeof y === 'string') {
            const [_, sign, value, percent] = /([-+s]?)(\d+)(%?)/.exec(y);
            let newY = 0;

            if (sign === 's') {
                newY = value * (GAME_CONFIG.size.height / 100);
            } else {
                const offset = percent ? displayObject.height * parseFloat(value) / 100 : parseFloat(value);
                newY = sign === '-' ? -offset : offset;
            }

            displayObject.y = newY;
        } else {
            displayObject.y = y;
        }

        if (anchor) {
            if (typeof anchor === 'number') {
                displayObject.anchor.set(anchor);
            } else {
                if (anchor.x !== undefined) {
                    displayObject.anchor.x = anchor.x;
                }

                if (anchor.y !== undefined) {
                    displayObject.anchor.y = anchor.y;
                }
            }
        }

        other && Object.keys(other).forEach(key => {
            if (displayObject[key] !== undefined) {
                displayObject[key] = other[key];
            }
        });

        if (layer) {
            displayObject.parentLayer = this.layers.get(layer);
        }
    }

    sprite({texture, ...properties}) {
        const displayObject = new Sprite(this.textures.get(texture));
        displayObject.name = texture;

        return this.addAndSetProperties(displayObject, properties);
    }

    text({text = '', style = '', ...properties} = {}) {
        const displayObject = new Text(text, new TextStyle(this.styles.get(style)));

        displayObject.resolution = 2;

        return this.addAndSetProperties(displayObject, properties);
    }

    container(properties) {
        const displayObject = new SuperContainer();

        return this.addAndSetProperties(displayObject, properties);
    }

    animation(name, properties) {
        const sprites = this.textures.get('animations').animations[name];
        const displayObject = new AnimatedSprite(sprites);

        return this.addAndSetProperties(displayObject, properties);

    }

    displayObject(displayObjectConstructor, properties) {
        const displayObject = new displayObjectConstructor();

        return this.addAndSetProperties(displayObject, properties);
    }

    addAndSetProperties(displayObject, properties) {
        this.addDisplayObject(displayObject, properties)
        this.setDisplayObjectProperties(displayObject, properties);

        return displayObject;
    }

    addDisplayObject(displayObject, properties) {
        this.parent.addChild(displayObject);
    }
}

export class ObjectFactory {
    static createSprite(textureName, params = {}) {
        const displayObject = new Sprite(Assets.get(textureName));

        this.setParametersToDisplayObject(displayObject, params);

        return displayObject;
    }

    static createText(text, styleName = '', params = {}) {
        const style = new TextStyle(styleName ? Styles[styleName] : {});
        const displayObject = new Text(text, style);

        this.setParametersToDisplayObject(displayObject, params);

        return displayObject;
    }


    static setParametersToDisplayObject(displayObject, {x = 0, y = 0, anchor} = {}) {
        displayObject.x = x;
        displayObject.y = y;

        if (anchor) {
            if (anchor.x !== undefined) {
                displayObject.anchor.x = anchor.x;
            }

            if (anchor.y !== undefined) {
                displayObject.anchor.y = anchor.y;
            }
        }
    }
}
