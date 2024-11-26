import { MongoClient } from "mongodb";

export class MongoDBAdapter {
    /**
     * Конструктор класса MongoDBAdapter.
     * @param {string} connectionString - Строка подключения к MongoDB.
     * @param {string} dbName - Имя базы данных.
     */
    constructor(connectionString, dbName, taskTemplate) {
        this.client = new MongoClient(connectionString, { useUnifiedTopology: true });
        this.dbName = dbName;
        this.playersCollection = null;
        this.tasksTemplate = taskTemplate;
    }

    /**
     * Инициализация подключения к MongoDB.
     */
    async connect() {
        await this.client.connect();
        const db = this.client.db(this.dbName);
        this.playersCollection = db.collection("players");
        this.tasksTemplateCollection =
        console.log("Connected to MongoDB");
    }

    /**
     * Закрытие подключения к MongoDB.
     */
    async close() {
        await this.client.close();
        console.log("Disconnected from MongoDB");
    }

    /**
     * Найти игрока по ID.
     * @param {string} id - Идентификатор игрока.
     * @returns {Object|null} Данные игрока.
     */
    async findPlayerById(id) {
        return await this.playersCollection.findOne({ id });
    }

    /**
     * Получить всех игроков.
     * @returns {Array<Object>} Список игроков.
     */
    async getAllPlayers() {
        return await this.playersCollection.find({}).toArray();
    }

    /**
     * Создать игрока.
     * @param {Object} playerData - Данные нового игрока.
     */
    async createPlayer(playerData) {
        const existingPlayer = await this.findPlayerById(playerData.id);

        if (existingPlayer) {
            throw new Error(`Player with ID ${playerData.id} already exists`);
        }

        playerData.tasks = this.tasksTemplate.map(task => ({
            id: task.id,
            type: task.type,
            title: task.title,
            description: task.description,
            reward: task.reward,
            goal: task.goal || null,
            progress: 0,
            counted: 0,
            status: "in_progress",
            actionRequired: task.actionRequired,
            repeatable: task.repeatable,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));

        await this.playersCollection.insertOne(playerData);

        return playerData;
    }

    /**
     * Сохранить сессию игрока.
     * @param {string} playerID - Идентификатор игрока.
     * @param {Object} sessionData - Данные сессии.
     */
    async saveSession(playerID, sessionData) {
        const result = await this.playersCollection.updateOne(
            { id: playerID },
            { $set: { session: sessionData } }
        );

        if (result.matchedCount === 0) {
            throw new Error(`Player with ID ${playerID} not found`);
        }
    }

    /**
     * Обновить данные игрока.
     * @param {string} id - Идентификатор игрока.
     * @param {Object} playerData - Новые данные игрока.
     */
    async updatePlayer(id, playerData) {
        const result = await this.playersCollection.updateOne(
            { id },
            { $set: playerData }
        );

        if (result.matchedCount === 0) {
            throw new Error(`Player with ID ${id} not found`);
        }
    }
}
