import {HTTPServer} from './HTTPServer.js';
import dotenv from 'dotenv';
import fs from 'fs';
import {FileDatabaseAdapter} from "./db/FileDatabaseAdapter.js";
import {GameServer} from "./game/GameServer.js";
import {Api, Bot} from "grammy";
import {MongoDBAdapter} from "./db/MongoDBAdapter.js";

dotenv.config('./.env');

// const bot  = new TelagramBot(process.env.BOT_TOKEN);

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
};
const taskTemplate = JSON.parse(fs.readFileSync('./task_templates.json', "utf-8"))
const isDev = process.env.NODE_ENV === 'development';
const db = new MongoDBAdapter(process.env.MONGO_URL, process.env.MONGO_DB_NAME, taskTemplate);

await db.connect();
// const fileDB = new FileDatabaseAdapter('./', taskTemplate);

const game = new GameServer(process.env.BOT_TOKEN, db, isDev);

const httpServer = new HTTPServer(options);

httpServer.addAPI(game, ['initSession', 'placeBet', 'cashOut', 'getTasks', 'claimTaskReward']);
// httpServer.addAPI(bot, ['fromTelegram', 'getInvoiceLink']);
httpServer.start({port: process.env.PORT});

async function onTerminate() {
    await game.saveState();
    httpServer.stop();
    process.exit(0);
}

process.on('SIGINT', onTerminate);
process.on('SIGTERM', onTerminate);
