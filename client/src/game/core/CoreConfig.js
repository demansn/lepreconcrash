import {PixiApplication} from "./PixiApplication.js";
import {GameLogic} from "./GameLogic.js";
import {StateController} from "./StateController.js";
import {SceneManager} from "./SceneManager.js";
import {AnalystService} from "../../../../shared/AnalystService.js";

export const CoreConfig = {
    systems: [
        {System: AnalystService, name: 'AnalystService'},
        {System: PixiApplication, name: 'PixiApplication'},
        {System: GameLogic, name: 'GameLogic'},
        {System: StateController, name: 'StateController'},
        {System: SceneManager, name: 'SceneManager'},
    ]
}
