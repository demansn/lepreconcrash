import assert from 'assert';
import { describe, it, beforeEach } from 'node:test';
import { GameServer } from '../game/GameServer.js';
import { PlayersManager } from '../game/PlayersManager.js';
import { TaskAction } from '../../shared/TaskAction.js';

describe('rewardForInviting', () => {
    let gameServer, playersManagerMock, dbAdapterMock;

    beforeEach(() => {
        // Моки для зависимостей
        dbAdapterMock = {
            findPlayerById: async (id) => playersManagerMock.getPlayer(id),
            savePlayer: async (player) => playersManagerMock.savePlayer(player),
        };

        playersManagerMock = new PlayersManager(dbAdapterMock);
        gameServer = new GameServer('mock_bot_token', dbAdapterMock);

        // Преднастройка игроков
        playersManagerMock.createPlayer({
            id: 'inviter_id',
            balance: 100,
            tasks: [
                {
                    id: 'invite_friend',
                    type: 'friends',
                    actionRequired: TaskAction.INVITE_FRIEND,
                    reward: 100,
                    progress: 0,
                    goal: 1,
                    status: 'in_progress',
                },
            ],
        });

        playersManagerMock.createPlayer({
            id: 'invited_id',
            balance: 0,
        });
    });

    it('should reward inviter for inviting a regular friend', async () => {
        await gameServer.rewardForInviting('inviter_id', 'invited_id', false);

        const inviter = await playersManagerMock.getPlayer('inviter_id');
        const task = inviter.getTask('invite_friend');

        assert.strictEqual(task.progress, 1);
        assert.strictEqual(task.status, 'ready_to_claim');

        const reward = task.claimReward();

        assert.strictEqual(reward, 100);
        assert.strictEqual(inviter.balance, 200); // 100 (initial) + 100 (reward)
    });

    it('should reward inviter for inviting a premium friend', async () => {
        await gameServer.rewardForInviting('inviter_id', 'invited_id', true);

        const inviter = await playersManagerMock.getPlayer('inviter_id');
        const task = inviter.getTask('invite_friend_premium');

        assert.strictEqual(task.progress, 1);
        assert.strictEqual(task.status, 'ready_to_claim');

        const reward = task.claimReward();

        assert.strictEqual(reward, 300); // Reward for premium friend
        assert.strictEqual(inviter.balance, 400); // 100 (initial) + 300 (reward)
    });

    it('should not throw error if inviter does not exist', async () => {
        const result = await gameServer.rewardForInviting('nonexistent_id', 'invited_id', false);

        assert.strictEqual(result, undefined); // No errors
    });
});
