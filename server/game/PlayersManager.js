import {Player} from "./Player.js";

export class PlayersManager {
    constructor(dbAdapter) {
        this.dbAdapter = dbAdapter;
    }

    async createPlayer(newPlayer) {
        const playerData = await this.dbAdapter.createPlayer(newPlayer);

        return new Player(playerData,  this.dbAdapter.getTasks());
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

        return new Player(playerData, this.dbAdapter.getTasks());
    }

    /**
     * Сохраняет игрока.
     * @param {Player} player - Экземпляр класса Player.
     */
    async savePlayer(player) {
        await this.dbAdapter.updatePlayer(player.id, player.toSaveObject());
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
    updateDailyTasks(player, nextDailyUpdate) {
        const lastUpdated = new Date(player.lastDailyUpdate || 0);
        const now = new Date();

        if (lastUpdated <= now) {
            player.tasks.forEach(task => {
                if (task.isDaily()) {
                    task.resetProgress();
                }
            });
            player.lastDailyUpdate = now.toISOString();
            player.nextDailyUpdate = nextDailyUpdate;
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

    async getTopPlayer() {
        const players = await this.dbAdapter.getTopPlayers();

        return players.map(player => {
            const fullName = `${player.profile.firstName || ''} ${player.profile.lastName || ''}`.trim();
            const username = fullName || player.profile.username || 'Anonymous';
            const photo = player.profile.photo || '';
            const luck = player.luck;

            return { username, luck, photo };
        });
    }
}
