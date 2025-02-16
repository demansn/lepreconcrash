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

        await this.gamesScene.spin(symbol);
        this.header.animateTo(player);
        await this.gamesScene.showWinPopup(reward);

        this.gamesScene.enableUI();
    }

    exit() {
        super.exit();
        this.gamesScene.hideSlotGame();
    }
}
