import {BaseState} from "../core/stateMachine/BaseState.js";

export class GameBaseState  extends BaseState {
    constructor(parameters) {
        super(parameters);

        const {dependencies} = parameters;

        /**
         * @type {SceneManager}
         */
        this.scene = dependencies.resolve('SceneManager');
        /**
         * @type {GameLogic}
         */
        this.gameLogic = dependencies.resolve('GameLogic');
    }

    error(e) {
        this.gameLogic.showAlert('Error', e);
    }
}
