import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

export class FileDatabaseAdapter {
    constructor(databasePath, ) {
        this.databasePath = databasePath;
        this.fileName = "database.json";
        this.databaseFilePath = path.join(this.databasePath, this.fileName);

        this.tasksTemplate = JSON.parse(fsSync.readFile('./task_templates.json', "utf-8"));
    }

    async loadFile() {
        try {
            const fileData = await fs.readFile(this.databaseFilePath, "utf-8");
            return JSON.parse(fileData);
        } catch (error) {
            if (error.code === "ENOENT") {
                return {};
            }
            throw error;
        }
    }

    async saveFile(data) {
        await fs.writeFile(this.databaseFilePath, JSON.stringify(data, null, 4));
    }

    async findPlayerById(id) {
        const data = await this.loadFile();
        return data[id] || null;
    }

    async getAllPlayers() {
        const data = await this.loadFile();
        return Object.values(data);
    }

    async createPlayer(playerData) {
        const data = await this.loadFile();

        if (data[playerData.id]) {
            throw new Error(`Player with ID ${playerData.id} already exists`);
        }

        data[playerData.id] = playerData;

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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));

        await this.saveFile(data);

        return playerData;
    }

    async saveSession(playerID, sessionData) {
        const data = await this.loadFile();

        if (!data[playerID]) {
            throw new Error(`Player with ID ${playerID} not found`);
        }

        data[playerID].session = sessionData;

        await this.saveFile(data);
    }

    async updatePlayer(id, playerData) {
        const data = await this.loadFile();

        if (!data[id]) {
            throw new Error(`Player with ID ${id} not found`);
        }

        console.log('playerData', playerData);

        data[id] = { ...data[id], ...playerData };

        await this.saveFile(data);
    }
}
