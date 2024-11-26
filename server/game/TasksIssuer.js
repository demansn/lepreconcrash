import {TaskStatus} from "../../shared/TaskStatus.js";

export class TasksIssuer {
    /**
     * Конструктор класса TasksIssuer
     * @param {Object} dataAdapter - Адаптер данных, предоставляющий методы для работы с игроками.
     * @param {string} dailyResetTime - Время сброса ежедневных заданий (формат "HH:mm").
     */
    constructor(dataAdapter, dailyResetTime = "00:00") {
        this.dataAdapter = dataAdapter; // Используется адаптер для работы с данными
        this.dailyResetTime = dailyResetTime;
    }

    /**
     * Проверяет, нужно ли обновить ежедневные задания.
     * @param {Date} lastUpdated - Последнее время обновления заданий.
     * @returns {boolean} Нужно ли обновить задания.
     */
    shouldUpdateDailyTasks(lastUpdated) {
        const now = new Date();
        const resetTime = new Date(now);
        const [hours, minutes] = this.dailyResetTime.split(":").map(Number);
        resetTime.setHours(hours, minutes, 0, 0);

        return lastUpdated < resetTime && now >= resetTime;
    }

    /**
     * Обновляет ежедневные задания для всех игроков.
     */
    async updateDailyTasks() {
        const players = await this.dataAdapter.getAllPlayers();

        for (const player of players) {
            const lastUpdated = new Date(player.lastDailyUpdate || 0);

            if (this.shouldUpdateDailyTasks(lastUpdated)) {
                this.resetDailyTasks(player);
                player.lastDailyUpdate = new Date().toISOString();
                await this.dataAdapter.updatePlayer(player);
            }
        }
    }

    /**
     * Сбрасывает ежедневные задания игрока.
     * @param {Object} player - Данные игрока.
     */
    resetDailyTasks(player) {
        player.tasks.forEach(task => {
            if (task.type === "daily") {
                task.progress = 0;
                task.status = TaskStatus.IN_PROGRESS;
                task.updatedAt = new Date().toISOString();
            }
        });
    }

    /**
     * Обновляет задание игрока при выполнении действия.
     * @param {string} playerId - Идентификатор игрока.
     * @param {TaskAction} actionType - Тип выполненного действия (например, "play_game").
     * @param {number} progressIncrement - Увеличение прогресса задания.
     */
    async updateTaskOnAction(playerId, actionType, progressIncrement = 1) {
        const player = await this.dataAdapter.findPlayerById(playerId);

        if (!player) {
            throw new Error(`Player with ID ${playerId} not found.`);
        }

        let tasksUpdated = false;

        player.tasks.forEach(task => {
            if (task.actionRequired === actionType && task.status === TaskStatus.IN_PROGRESS) {
                task.progress += progressIncrement;

                if (task.progress >= task.goal) {
                    task.status = TaskStatus.READY_TO_CLAIM;
                }

                task.updatedAt = new Date().toISOString();
                tasksUpdated = true;
            }
        });

        if (tasksUpdated) {
            await this.dataAdapter.updatePlayer(player);
        }
    }

    /**
     * Запускает процесс обновления ежедневных заданий по расписанию.
     */
    startDailyTaskUpdater() {
        const now = new Date();
        const [hours, minutes] = this.dailyResetTime.split(":").map(Number);
        const nextReset = new Date(now);
        nextReset.setHours(hours, minutes, 0, 0);

        if (now >= nextReset) {
            nextReset.setDate(nextReset.getDate() + 1);
        }

        const delay = nextReset - now;

        setTimeout(async () => {
            await this.updateDailyTasks();
            this.startDailyTaskUpdater(); // Запускаем следующий цикл
        }, delay);
    }
}
