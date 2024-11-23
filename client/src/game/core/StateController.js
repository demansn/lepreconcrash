import {StateMachine} from "./stateMachine/StateMachine.js";

export class StateController {
    constructor(dependencies) {
        this.#dependencies = dependencies;
    }

    #dependencies;

    create({states = {}, enterState}) {
        this.stateMachine = new StateMachine({dependencies: this.#dependencies, states: states});
        this.enterState = enterState;
    }

    start() {
        this.goTo(this.enterState);
    }

    goTo(name) {
        this.stateMachine.goTo(name);
    }
}
