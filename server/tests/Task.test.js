import assert from 'assert';
import { describe, it, beforeEach } from 'node:test';
import fs from 'fs';
import { Task } from '../game/tasks/Task.js';
import { TaskStatus } from '../../shared/TaskStatus.js';
import { TaskAction } from '../../shared/TaskAction.js';

// Загружаем шаблоны заданий
const tasks = JSON.parse(fs.readFileSync('task_templates.json', 'utf8'));

// Утилита для получения задачи по ID
const getTask = (id) => JSON.parse(JSON.stringify(tasks.find(task => task.id === id))); // Клонируем данные

describe('Task Use Cases', () => {
    describe('Daily Tasks', () => {
        let dailyLoginTask;

        beforeEach(() => {
            dailyLoginTask = new Task(getTask('daily_login'));
        });

        it('should update progress and mark as ready to claim', () => {
            dailyLoginTask.updateOnAction(TaskAction.CLAIM_DAILY_REWARD);

            assert.strictEqual(dailyLoginTask.data.progress, 1);
            assert.strictEqual(dailyLoginTask.data.status, TaskStatus.READY_TO_CLAIM);
        });

        it('should claim reward and mark as claimed', () => {
            dailyLoginTask.updateOnAction(TaskAction.CLAIM_DAILY_REWARD);
            const reward = dailyLoginTask.claimReward();

            assert.strictEqual(reward, dailyLoginTask.data.reward);
            assert.strictEqual(dailyLoginTask.data.status, TaskStatus.CLAIMED);
        });
    });

    describe('Basic Tasks', () => {
        let sharePhoneTask;

        beforeEach(() => {
            sharePhoneTask = new Task(getTask('share_phone_number'));
        });

        it('should update progress and mark as ready to claim', () => {
            sharePhoneTask.updateOnAction(TaskAction.SHARE_PHONE);

            assert.strictEqual(sharePhoneTask.data.progress, 1);
            assert.strictEqual(sharePhoneTask.data.status, TaskStatus.READY_TO_CLAIM);
        });

        it('should claim reward and mark as claimed', () => {
            sharePhoneTask.updateOnAction(TaskAction.SHARE_PHONE);
            const reward = sharePhoneTask.claimReward();

            assert.strictEqual(reward, sharePhoneTask.data.reward);
            assert.strictEqual(sharePhoneTask.data.status, TaskStatus.CLAIMED);
        });

        it('should not allow further updates after claiming', () => {
            sharePhoneTask.updateOnAction(TaskAction.SHARE_PHONE);
            const reward = sharePhoneTask.claimReward();
            sharePhoneTask.updateOnAction(TaskAction.SHARE_PHONE);

            assert.strictEqual(reward, sharePhoneTask.data.reward);
            assert.strictEqual(sharePhoneTask.data.progress, 1);
            assert.strictEqual(sharePhoneTask.data.status, TaskStatus.CLAIMED);
        });

        it('should not give reward on second claim', () => {
            sharePhoneTask.updateOnAction(TaskAction.SHARE_PHONE);
            const firstReward = sharePhoneTask.claimReward();
            const secondReward = sharePhoneTask.claimReward();

            assert.strictEqual(firstReward, sharePhoneTask.data.reward);
            assert.strictEqual(secondReward, 0);
            assert.strictEqual(sharePhoneTask.data.status, TaskStatus.CLAIMED);
        });
    });

    describe('Friends Tasks', () => {
        let inviteFriendTask;

        beforeEach(() => {
            inviteFriendTask = new Task(getTask('invite_friend'));
        });

        it('should update progress for each friend invited', () => {
            inviteFriendTask.updateOnAction(TaskAction.INVITE_FRIEND);

            assert.strictEqual(inviteFriendTask.data.progress, 1);
            assert.strictEqual(inviteFriendTask.data.status, TaskStatus.READY_TO_CLAIM);
        });

        it('should reset progress after claiming for repeatable task', () => {
            inviteFriendTask.updateOnAction(TaskAction.INVITE_FRIEND);
            const reward = inviteFriendTask.claimReward();

            assert.strictEqual(reward, inviteFriendTask.data.reward);
            assert.strictEqual(inviteFriendTask.data.progress, 0);
            assert.strictEqual(inviteFriendTask.data.status, TaskStatus.IN_PROGRESS);
        });

        it('should correctly handle multiple claims', () => {
            inviteFriendTask.updateOnAction(TaskAction.INVITE_FRIEND);
            const reward1 = inviteFriendTask.claimReward();

            inviteFriendTask.updateOnAction(TaskAction.INVITE_FRIEND);
            const reward2 = inviteFriendTask.claimReward();

            assert.strictEqual(reward1, inviteFriendTask.data.reward);
            assert.strictEqual(reward2, inviteFriendTask.data.reward);
            assert.strictEqual(inviteFriendTask.data.progress, 0);
        });


        it('should calculate partial reward for repeatable task', () => {
            inviteFriendTask.updateOnAction(TaskAction.INVITE_FRIEND); // progress = 1, goal = 1
            const partialReward1 = inviteFriendTask.claimReward();

            inviteFriendTask.updateOnAction(TaskAction.INVITE_FRIEND);
            inviteFriendTask.updateOnAction(TaskAction.INVITE_FRIEND); // progress = 2, goal = 1
            const partialReward2 = inviteFriendTask.claimReward();

            assert.strictEqual(partialReward1, inviteFriendTask.data.reward);
            assert.strictEqual(partialReward2, 2 * inviteFriendTask.data.reward);
            assert.strictEqual(inviteFriendTask.data.counted, 3); // Total progress counted
        });
    });

    describe('Complex Scenarios', () => {
        it('should handle mixed updates for multiple tasks', () => {
            const dailyTask = new Task(getTask('daily_play_3_games'));
            const basicTask = new Task(getTask('share_email_address'));

            dailyTask.updateOnAction(TaskAction.PLAY_GAME);
            dailyTask.updateOnAction(TaskAction.PLAY_GAME);
            dailyTask.updateOnAction(TaskAction.PLAY_GAME);

            basicTask.updateOnAction(TaskAction.SHARE_EMAIL);

            assert.strictEqual(dailyTask.data.progress, 3);
            assert.strictEqual(dailyTask.data.status, TaskStatus.READY_TO_CLAIM);

            assert.strictEqual(basicTask.data.progress, 1);
            assert.strictEqual(basicTask.data.status, TaskStatus.READY_TO_CLAIM);

            const dailyReward = dailyTask.claimReward();
            const basicReward = basicTask.claimReward();

            assert.strictEqual(dailyReward, dailyTask.data.reward);
            assert.strictEqual(basicReward, basicTask.data.reward);
        });
    });
});
