
import GameState from './GameState.js';

class GameInitState extends GameState {
  async enter() {
    console.log("Entering GameInitState");
    // Custom logic for initializing game state
    await super.enter();
  }
}

export default GameInitState;
        