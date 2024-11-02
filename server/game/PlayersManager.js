import {Player} from "./Player.js";

export class PlayersManager {
    constructor(dbAdapter) {
        this.dbAdapter = dbAdapter;
    }

    async #createPlayer(playerID) {
        const newPlayer = {
            id: playerID,
            balance: 200,
            luck: 0,
            level: 0,
            session: null
        };

        return this.dbAdapter.createPlayer(newPlayer);
    }

    async getPlayer(playerID) {
        let data = await this.dbAdapter.findPlayerById(playerID);

        if (!data) {
            data = await this.#createPlayer(playerID);
        }

        return new Player(data);
    }

    async savePlayer(player) {
        return this.updatePlayer(player.id, player.toObject());
    }

    async updatePlayer(playerID, data) {
        return this.dbAdapter.updatePlayer(playerID, data);
    }
}
