import {StateMachine} from "./StateMachine.js";

export class BaseState {
    #state = null;

    constructor({owner, name, states, scenes, dependencies, options, ...rest}) {
        this.owner = owner;
        this.name = name;
        this.#state = states ? new StateMachine({owner: this, states, dependencies, ...rest}) : null;

        this.options = options || {};

        const sceneManager = dependencies.resolve('SceneManager');

        if (scenes) {
            for (const [name, scene] of Object.entries(scenes)) {
                if (this[name]) {
                    throw new Error(`Scene already has a property named ${name}`);
                }

                this[name] = sceneManager.getScene(scene);
            }
        }
    }

    getOption(name) {
        return this.options[name];
    }

    enter() {

    }

    exit() {

    }

    goTo(name) {
        if (!this.#state) {
            throw new Error('State machine is not defined');
        }

        this.#state.goTo(name);
    }

    get currentState() {
        if (!this.#state) {
            throw new Error('State machine is not defined');
        }

        return this.#state.currentState;
    }
}
