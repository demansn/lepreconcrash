import {Card} from "../../gameObjects/tabs/Card.js";
import {GameCardContent} from "./GameCardContent.js";

export class GameCard extends Card {
    createContent(parameters) {
        super.createContent();

        this.content.addObject(GameCardContent, {...parameters}, {x: 26, y: 26});
    }
}
