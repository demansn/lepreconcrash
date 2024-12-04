import {HTTPServer} from './HTTPServer.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'node:path';
import {GameServer} from "./game/GameServer.js";
import {Api, Bot} from "grammy";
import {MongoDBAdapter} from "./db/MongoDBAdapter.js";
import {ServiceLocator} from "./game/ServiceLocator.js";

dotenv.config(path.join(process.env.PWD, '.env'));

const bot = new Bot(process.env.BOT_TOKEN);
await bot.api.setWebhook(process.env.WEBHOOK_URL);

ServiceLocator.getInstance().set('logger', console);

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
};
const taskTemplate = JSON.parse(fs.readFileSync('./task_templates.json', "utf-8"))
const db = new MongoDBAdapter(process.env.MONGO_URL, process.env.MONGO_DB_NAME, taskTemplate);

await db.connect();
// const fileDB = new FileDatabaseAdapter('./', taskTemplate);

const game = new GameServer(process.env.BOT_TOKEN, db);

const httpServer = new HTTPServer(options);

httpServer.addAPI(game, ['initSession', 'placeBet', 'cashOut', 'getTasks', 'claimTaskReward', 'fromTelegram', 'getInvoiceLink', 'getLeaderBoard', 'applyTaskAction']);
httpServer.start({port: process.env.PORT});

async function onTerminate() {
    await game.saveState();
    httpServer.stop();
    process.exit(0);
}

process.on('SIGINT', onTerminate);
process.on('SIGTERM', onTerminate);
