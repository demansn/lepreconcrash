import {Sprite, Assets, Text, TextStyle, Container} from 'pixi.js';
import {Styles} from "../configs/styles";

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

        this.create = new DisplayObjectsFactory(this, Assets, styles);
        this.state = new DisplayObjectStateMachine(this)
    }
}

export class DisplayObjectsFactory {
    constructor(parent, textures, styles) {
        this.parent = parent;
        this.textures= textures;
        this.styles= styles;
    }

    setDisplayObjectProperties(displayObject, properties = {}) {
        const {x = 0, y = 0, anchor, ...other} = properties;

        if (typeof x === 'string') {
            const [_, sign, value, percent] = /([-+]?)(\d+)(%?)/.exec(x);
            const offset = percent ? displayObject.width * parseFloat(value) / 100 : parseFloat(value);

            displayObject.x = sign === '-' ? -offset : offset;
        } else {
            displayObject.x = x;
        }

        if (typeof y === 'string') {
            const [_, sign, value, percent] = /([-+]?)(\d+)(%?)/.exec(y);
            const offset = percent ? displayObject.width * parseFloat(value) / 100 : parseFloat(value);

            displayObject.y = sign === '-' ? -offset : offset;
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
    }

    sprite({texture, ...properties}) {
        const displayObject = new Sprite(this.textures.get(texture));

        return this.addAndSetProperties(displayObject, properties);
    }

    text({text = '', style = '', ...properties} = {}) {
        const displayObject = new Text(text, new TextStyle(this.styles.get(style)));

        return this.addAndSetProperties(displayObject, properties);
    }

    container(properties) {
        const displayObject = new SuperContainer();

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
