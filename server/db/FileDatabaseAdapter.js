import fs from 'fs/promises';
import path from 'path';

export class FileDatabaseAdapter {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async loadFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {};
            }
            throw error;
        }
    }

    async saveFile(data) {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(this.filePath, jsonData, 'utf-8');
    }

    async findPlayerById(id) {
        const data = await this.loadFile();
        return data[id] || null;
    }

    async createPlayer(playerData) {
        const data = await this.loadFile();
        data[playerData.id] = playerData;
        await this.saveFile(data);
        return playerData;
    }

    async saveSession(playerID, sessionData) {
        const data = await this.loadFile();

        data[playerID].session = sessionData;

        await this.saveFile(data);
    }

    async updatePlayer(id, playerData) {
        const data = await this.loadFile();

        if (!data[id]) {
            throw new Error(`Player with ID ${id} not found`);
        }
        data[id] = { ...data[id], ...playerData };

        await this.saveFile(data);
    }

    async deletePlayer(id) {
        const data = await this.loadFile();
        if (!data[id]) {
            throw new Error(`Player with ID ${id} not found`);
        }
        delete data[id];
        await this.saveFile(data);
    }
}
