import {PlayersManager} from "./PlayersManager.js";
import {validateSignature} from "../utils.js";
import {GameSessionsManager} from "./GameSessionsManager.js";
import {GameMath} from "./GameMath.js";
import {GameSteps} from "./GameSteps.js";

export class GameServer {
    #botToken;
    #players;
    #sessions;
    #gameSteps = GameSteps.map(({number, multiplier}) => ({number, multiplier}));
    #math = new GameMath(GameSteps);

    constructor(botToken, dbAdapter) {
        this.#botToken = botToken;
        this.#sessions = new GameSessionsManager();
        this.#players = new PlayersManager(dbAdapter);
    }

    async initSession(telegramInitData) {
        const playerData = validateSignature(telegramInitData, this.#botToken);

        if (!playerData) {
            throw new Error('Invalid signature');
        }

        const player = await this.#players.getPlayer(playerData.user.id);

        return {
            id: this.#sessions.createSession(player.id),
            steps: this.#gameSteps,
            player: {
                balance: player.getBalance(),
                luck: player.getLuck(),
                level: player.getLevel()
            }};
    }

    async placeBet(bet, sessionID) {
        const gameSession = this.#sessions.get(sessionID);

        if (!gameSession) {
            throw new Error('Session not found');
        }

        const player = await this.#players.getPlayer(gameSession.playerID);

        if (!player) {
            throw new Error('Player not found');
        }

        if (player.balance < bet) {
            throw new Error('Not enough balance');
        }

        if (gameSession.hasGameRound()) {
            throw new Error('Current round is not completed!');
        }

        player.subBalance(bet);

        await this.#players.savePlayer(player);

        gameSession.startGameRound(this.#math.getRandomGameRound(bet));

        return {
            player: {
                balance: player.balance,
                luck: player.luck,
                level: player.level
            },
            gameRound: gameSession.getGameRoundInfo()
        };
    }

    async nextStep(sessionID) {
        const gameSession = this.#sessions.get(sessionID);

        if (!gameSession) {
            throw new Error('Session not found');
        }

        if (!gameSession.hasGameRound()) {
            throw new Error('Not placed bet!');
        }

        const gameRound = gameSession.nextStep();

        return {gameRound};
    }

    async cashOut(sessionID) {
        const gameSession = this.#sessions.get(sessionID);

        if (!gameSession) {
            throw new Error('Session not found');
        }

        const player = await this.#players.getPlayer(gameSession.playerID);

        if (!player) {
            throw new Error('Player not found');
        }

        const result = gameSession.finishGameRound();

        console.dir(player);

        if (result.isWin) {
            player.addBalance(result.win);
            player.addLuck(result.luck);
            player.setLevel(result.level);

            await this.#players.savePlayer(player);
        }

        return {
            player: {
                balance: player.balance,
                luck: player.luck,
                level: player.level
            },
            gameRound: result
        };
    }
}
