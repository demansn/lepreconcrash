import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { GameServer } from '../game/GameServer.js';
import { FileDatabaseAdapter } from '../db/FileDatabaseAdapter.js';
import fs from 'fs';


import dotenv from 'dotenv';
dotenv.config();

const telegramInitData = 'user=%7B%22id%22%3A377643721%2C%22first_name%22%3A%22Dima%22%2C%22last_name%22%3A%22Lysenko%22%2C%22username%22%3A%22demansn%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=7611820537657558260&chat_type=private&auth_date=1730101555&hash=86ba6cfaaf6479695c400bbe63a30e3816071b451cd0dbb6edd128ff0b142342';
const botToken = process.env.BOT_TOKEN;

if (fs.existsSync('test_db.json')) {
    fs.unlinkSync('test_db.json');
}

const dbAdapter = new FileDatabaseAdapter('test_db.json');


test('GameServer: getPlayerInfo with valid signature', async () => {
    const gameServer = new GameServer(botToken, dbAdapter);

    const {player} = await gameServer.intSession(telegramInitData);

    assert.deepEqual(player, {
        balance: 200,
        luck: 0,
        level: 0
    });
});

test('GameServer: getPlayerInfo with invalid signature', async () => {
    const gameServer = new GameServer(botToken, dbAdapter);

    await assert.rejects(async () => {
        await gameServer.intSession(telegramInitData + 'sdfs');
    }, new Error('Invalid signature'));
});

test('GameServer: placeBet throws error if round not completed', () => {
    const gameServer = new GameServer(botToken, dbAdapter);

    assert.throws(() => {
        gameServer.placeBet(100, 'session1');
    }, new Error('Session not found'));
});
