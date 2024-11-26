import {Player} from "./Player.js";
import {TaskStatus} from "../../shared/TaskStatus.js";
import {TaskType} from "../../shared/TaskType.js";

export class PlayersManager {
    constructor(dbAdapter) {
        this.dbAdapter = dbAdapter;
    }

    async createPlayer(playerID) {
        const newPlayer = {
            id: playerID,
            balance: 200,
            luck: 0,
            level: 0,
            session: null,
            tasks: []
        };

        const playerData = await this.dbAdapter.createPlayer(newPlayer);

        return new Player(playerData);
    }

    /**
     * Загружает игрока по ID.
     * @param {string} ID - Идентификатор игрока.
     * @returns {Player} Экземпляр класса Player.
     */
    async getPlayer(ID) {
        let playerData = await this.dbAdapter.findPlayerById(ID);

        if (!playerData) {
            return undefined;
        }

        return new Player(playerData);
    }

    /**
     * Сохраняет игрока.
     * @param {Player} player - Экземпляр класса Player.
     */
    async savePlayer(player) {
        await this.dbAdapter.updatePlayer(player.id, player.toObject());
    }

    /**
     * Сохраняет игрока.
     * @param playerId
     * @param playerData
     */
    async updatePlayer(playerId, playerData) {
        await this.dbAdapter.updatePlayer(playerId, playerData);
    }

    /**
     * Возвращает всех игроков.
     * @returns {Array<Player>} Список игроков.
     */
    async getAllPlayers() {
        const data = await this.dbAdapter.getAllPlayers();

        return Object.values(data).map(playerData => new Player(playerData));
    }

    /**
     * Обновляет ежедневные задания для игрока.
     * @param {Player} player - Экземпляр класса Player.
     */
    updateDailyTasks(player) {
        const lastUpdated = new Date(player.lastDailyUpdate || 0);
        const now = new Date();

        if (lastUpdated <= now) {
            player.tasks.forEach(task => {
                if (task.isDaily()) {
                    task.resetProgress();
                }
            });
            player.lastDailyUpdate = now.toISOString();
        }
    }

    /**
     * Массовое обновление ежедневных заданий для всех игроков.
     */
    async updateAllDailyTasks() {
        const players = await this.getAllPlayers();

        for (const player of players) {
            this.updateDailyTasks(player);
            await this.savePlayer(player);
        }
    }
}
