import {HTTPServer} from './HTTPServer.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'node:path';
import {GameServer} from "./game/GameServer.js";
import {Api, Bot} from "grammy";
import {MongoDBAdapter} from "./db/MongoDBAdapter.js";
import {ServiceLocator} from "./game/ServiceLocator.js";
import {AnalystService} from "../shared/AnalystService.js";
import {ServerTelemetreeProvider} from "./game/ServerTelemetreeProvider.js";

dotenv.config(path.join(process.env.PWD, '.env'));

const bot = new Bot(process.env.BOT_TOKEN);
const isDev = process.env.NODE_ENV === 'development';
const analytics = new AnalystService();

try {
    await bot.api.setWebhook(process.env.WEBHOOK_URL);
    const webHook = await bot.api.getWebhookInfo();
    console.log(`Webhook info: ${JSON.stringify(webHook)}`);
} catch (e) {
    console.error(`Failed to set webhook: ${e}`);
}

const providers = [
    {
        name: 'telemetree',
        Constructor: ServerTelemetreeProvider,
        options: {
            projectId: process.env.TELEMETREE_PROJECT_ID,
            apiKey: process.env.TELEMETREE_API_KEY,
        }
    }
];

try {
    await analytics.create({providers});
} catch (e) {
    console.error(`Failed to initialize analytics: ${e}`);
}

ServiceLocator.set('analytics', analytics);
ServiceLocator.set('logger', console);

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
};
const taskTemplate = JSON.parse(fs.readFileSync('../shared/task_templates.json', "utf-8"))
const db = new MongoDBAdapter(process.env.MONGO_URL, process.env.MONGO_DB_NAME, taskTemplate);

await db.connect();
// const fileDB = new FileDatabaseAdapter('./', taskTemplate);

const game = new GameServer(process.env.BOT_TOKEN, db, isDev, process.env.CLIENT_DOMAIN, '@leppigo_channel');

const httpServer = new HTTPServer(options);

httpServer.addAPI(game, ['initSession', 'placeBet', 'cashOut', 'getTasks', 'claimTaskReward', 'fromTelegram', 'getInvoiceLink', 'getLeaderBoard', 'applyTaskAction', 'checkTask', 'spin', 'watchAdsTask', 'openCookie']);
httpServer.start({port: process.env.PORT});

async function onTerminate() {
    await game.saveState();
    httpServer.stop();
    process.exit(0);
}

process.on('SIGINT', onTerminate);
process.on('SIGTERM', onTerminate);
