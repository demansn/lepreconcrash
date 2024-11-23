import {HTTPServer} from './HTTPServer.js';
import dotenv from 'dotenv';
import fs from 'fs';
import {FileDatabaseAdapter} from "./db/FileDatabaseAdapter.js";
import {GameServer} from "./game/GameServer.js";
import {Api, Bot} from "grammy";

dotenv.config();



// const bot  = new TelagramBot(process.env.BOT_TOKEN);

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
};

const game = new GameServer(process.env.BOT_TOKEN, new FileDatabaseAdapter('./db.json'));

const httpServer = new HTTPServer(options);

httpServer.addAPI(game, ['initSession', 'placeBet', 'cashOut', 'getTasks']);
// httpServer.addAPI(bot, ['fromTelegram', 'getInvoiceLink']);
httpServer.start({port: 3001});

async function onTerminate() {
    await game.saveState();
    httpServer.stop();
    process.exit(0);
}

process.on('SIGINT', onTerminate);
process.on('SIGTERM', onTerminate);
