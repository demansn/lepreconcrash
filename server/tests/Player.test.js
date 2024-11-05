import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { Player } from '../game/Player.js';

test('Player: initialization', async () => {
    const player = new Player({balance: 200, luck: 0, level: 3, id: 1, session: 2});

    assert.equal(player.balance, 200);
    assert.equal(player.luck, 0);
    assert.equal(player.level, 3);
    assert.equal(player.id, 1);
    assert.equal(player.session, 2);
});

test('Player: addBalance', async () => {
    const player = new Player({balance: 200, luck: 0, level: 3, id: 1, session: 2});

    player.addBalance(0.3);

    assert.equal(player.balance, 200.3);
});

test('Player: subBalance', async () => {
    const player = new Player({balance: 200, luck: 0, level: 3, id: 1, session: 2});

    player.subBalance(0.3);

    assert.equal(player.balance, 199.7);
});

test('Player: addLuck', async () => {
    const player = new Player({balance: 200, luck: 0, level: 3, id: 1, session: 2});

    player.addLuck(0.3);

    assert.equal(player.luck, 0.3);
});

test('Player: toObject', async () => {
    const player = new Player({balance: 200, luck: 0, level: 3, id: 1, session: 2});

    assert.deepEqual(player.toObject(), {id: 1, balance: 200, luck: 0, level: 3});
});

test('Player: balance setter', async () => {
    const player = new Player({balance: 200, luck: 0, level: 3, id: 1, session: 2});

    player.balance = 300;

    assert.equal(player.balance, 300);
});

test('Player: luck setter', async () => {
    const player = new Player({balance: 200, luck: 0, level: 3, id: 1, session: 2});

    player.luck = 0.3;

    assert.equal(player.luck, 0.3);
});

test('Player: level setter', async () => {
    const player = new Player({balance: 200, luck: 0, level: 3, id: 1, session: 2});

    player.level = 4;

    assert.equal(player.level, 4);
});

test('Player: session getter', async () => {
    const player = new Player({balance: 200, luck: 0, level: 3, id: 1, session: 2});

    assert.equal(player.session, 2);
});
