import {DisplayObjectPropertiesSetter} from "./DisplayObjectPropertiesSetter.js";
import {Graphics, Sprite, TextStyle, Text, AnimatedSprite} from "pixi.js";
import {SuperContainer} from "./SuperContainer.js";

export class Mather {
    static objectsFactoriesByNames = {};
    static registerObjectFactory(name, factory) {
        Mather.objectsFactoriesByNames[name] = factory;
    }

    static registerObjectConstructor(name, constructor) {
        Mather.objectsFactoriesByNames[name] = (properties) => new constructor(properties);
    }

    static registerObjectConstructors(objects) {
        for (const [name, constructor] of Object.entries(objects)) {
            Mather.registerObjectConstructor(name, constructor);
        }
    }

    constructor(parent, textures, styles, layers, screenSize = {width: 0, height: 0}) {
        this.parent = parent;
        this.textures = textures;
        this.styles = styles;
        this.layers = layers;

        this.properties = new DisplayObjectPropertiesSetter(this.parent, screenSize);
    }

    object(name, properties = {}) {
        const factory = Mather.objectsFactoriesByNames[name];

        if (!factory) {
            if (this.getTexture(name)) {
                return this.sprite({texture: name, ...properties});
            }
        } else {
            const {parameters, ...rest} = properties;
            const displayObject = factory(parameters);

            return this.addAndSetProperties(displayObject, rest);
        }
    }

    sprite({texture, ...properties}) {
        const displayObject = new Sprite(this.textures.get(texture));

        return this.addAndSetProperties(displayObject, properties);
    }

    getTexture(texture) {
        return this.textures.get(texture);
    }

    text({text = '', style = '', ...properties} = {}) {
        const displayObject = new Text(text, new TextStyle(this.styles.get(style)));

        displayObject.resolution = 2;

        return this.addAndSetProperties(displayObject, properties);
    }

    graphics(properties = {}) {
        const displayObject = new Graphics();

        return this.addAndSetProperties(displayObject, properties);
    }

    animation({animation, ...properties}) {
        const textures = this.textures.get('animations').animations[animation];
        const displayObject = new AnimatedSprite(textures);

        return this.addAndSetProperties(displayObject, properties);
    }

    container(properties) {
        const displayObject = new SuperContainer();

        return this.addAndSetProperties(displayObject, properties);
    }

    displayObject(displayObjectConstructor, {parameters, ...properties} = {}) {
        const displayObject = new displayObjectConstructor(parameters || properties);

        return this.addAndSetProperties(displayObject, properties);
    }

    addAndSetProperties(displayObject, properties = {}) {
        const {layer, ...rest} = properties;
        this.addDisplayObject(displayObject, rest);

        this.properties.set(displayObject, rest);

        if (layer) {
            displayObject.parentLayer = this.layers.get(layer);
        }

        return displayObject;
    }

    addDisplayObject(displayObject, properties) {
        this.parent.addChild(displayObject);
    }
}
