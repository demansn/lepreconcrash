import {HTTPServer} from './HTTPServer.js';
import dotenv from 'dotenv';
import {FileDatabaseAdapter} from "./db/FileDatabaseAdapter.js";
import {GameServer} from "./game/GameServer.js";

dotenv.config();

const game = new GameServer(process.env.BOT_TOKEN, new FileDatabaseAdapter('./db.json'));
const httpServer = new HTTPServer();

httpServer.setAPI(game, ['initSession', 'placeBet', 'cashOut']);
httpServer.start({port: 3000});

async function onTerminate() {
    await game.saveState();
    httpServer.stop();
    process.exit(0);
}

process.on('SIGINT', onTerminate);
process.on('SIGTERM', onTerminate);
