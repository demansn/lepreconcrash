import {gsap} from "gsap";
import {GameBaseState} from "../GameBaseState.js";

export class SlotGameState extends GameBaseState {
    constructor(params) {
        super(params);

        this.gamesScene = this.scene.getScene('GamesScene');
        /**
         * @type {HeaderScene}
         */
        this.header = this.scene.getScene('HeaderScene');
    }
    enter() {
        super.enter();
        this.gamesScene.showSlotGame();
        this.gamesScene.on('closeGame', this.onCloseGame, this);
        this.gamesScene.on('spin', this.spin, this);
    }

    onCloseGame() {
        this.owner.goTo('SelectGameState');
    }

    async spin() {
        this.gamesScene.disableUI();

        const spinPromise = this.gameLogic.spin();
        this.header.setBalance(this.gameLogic.getBalance());

        const {symbol, reward, player} = await spinPromise;

        const tl = gsap.timeline();

        tl.add(this.gamesScene.spin(symbol))
        tl.add([
            () => this.header.animateTo(player),
            () => this.gamesScene.showWinPopup(reward)
        ], '-=0.5');
        tl.add(() => this.gamesScene.enableUI());
    }

    exit() {
        super.exit();
        this.gamesScene.hideSlotGame();
        this.gamesScene.off('closeGame');
        this.gamesScene.off('spin');
    }
}
