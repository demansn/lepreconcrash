import {MongoClient, ObjectId} from "mongodb";

export class MongoDBAdapter {
    /**
     * Конструктор класса MongoDBAdapter.
     * @param {string} connectionString - Строка подключения к MongoDB.
     * @param {string} dbName - Имя базы данных.
     * @param {[]} tasks - Имя базы данных.
     */
    constructor(connectionString, dbName, tasks) {
        this.client = new MongoClient(connectionString, { useUnifiedTopology: true });
        this.dbName = dbName;
        this.playersCollection = null;
        this.purchasesCollection = null;
        this.tasks = tasks;
    }

    /**
     * Инициализация подключения к MongoDB.
     */
    async connect() {
        await this.client.connect();
        const db = this.client.db(this.dbName);
        this.playersCollection = db.collection("players");
        this.purchasesCollection = db.collection("purchases");
        try {
            await this.updateAllTasks();
        } catch (e) {
            console.error(e);
        }
    }

    async updateAllTasks() {
        const taskIdsToRemove = ['share_phone_number', 'share_email_address', 'share_x_account'];
        const tasksToAdd = this.tasks.filter(({id}) => id === 'subscribe_twitter' || id === 'subscribe_telegram_channel').map(task => ({
            id: task.id,
            progress: 0,
            counted: 0,
            status: "in_progress",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));

        await this.playersCollection.updateMany(
            {'tasks.id': { $in: taskIdsToRemove }},
            {
                $pull: { tasks: { id: { $in: taskIdsToRemove } } },
            }
        );

        await this.playersCollection.updateMany(
            {},
            {
                $unset: {
                    'tasks.$[].type': '',
                    'tasks.$[].reward': '',
                    'tasks.$[].goal': '',
                    'tasks.$[].actionRequired': '',
                    'tasks.$[].repeatable': '',
                    'tasks.$[].icon': '',
                    'tasks.$[].description': '',
                    'tasks.$[].title': '',
                }
            }
        );

        for (const task of tasksToAdd) {
            await this.playersCollection.updateMany(
                {
                    "tasks.id": { $ne: task.id }
                },
                {
                    $addToSet: { tasks: task }
                }
            );
        }
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
    async getAllPlayers({pagination} = {}) {
        return await this.playersCollection.find({}).toArray();
    }

    async getTopPlayers(pagination = 20) {
        try {
            return await this.playersCollection
                .find({}, { projection: { 'profile.firstName': 1, 'profile.lastName': 1, 'profile.username': 1, 'profile.photo': 1, luck: 1 } })
                .sort({ luck: -1 })
                .limit(pagination)
                .toArray();
        } catch (error) {
            console.error('Error fetching top players:', error);
            throw error;
        }
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

        playerData.tasks = this.tasks.map(task => ({
            id: task.id,
            progress: 0,
            counted: 0,
            status: "in_progress",
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

    async addPurchasedItem(item) {
        const result = await this.purchasesCollection.insertOne({
            ...item,
            createdAt: new Date().toISOString(),
        });

        return result.insertedId.toString();
    }

   async updatePurchase(purchaseID, data) {
        return  await this.purchasesCollection.updateOne(
            { _id: new ObjectId(purchaseID) },
            { $set: {...data} }
        );
    }

    getTasks() {
        return this.tasks;
    }
}
