import {BaseState} from "../core/stateMachine/BaseState.js";

export class GameBaseState  extends BaseState {
    constructor(parameters) {
        super(parameters);

        const {dependencies} = parameters;

        this.scene = dependencies.resolve('SceneManager');
    }
}
