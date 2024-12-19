import {Game} from "./Game.js";

window.Telegram.WebApp.expand();

const game = Game.start();

game.scale();
