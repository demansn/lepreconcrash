
import GameState from './GameState.js';

class GameRestoreState extends GameState {
  async enter() {
    console.log("Entering GameRestoreState");
    // Custom logic for restoring game state
    await super.enter();
  }
}

export default GameRestoreState;
        