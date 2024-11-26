export class TaskScheduler {
    /**
     * Конструктор класса TaskScheduler.
     * @param {PlayersManager} playersManager - Экземпляр PlayersManager для работы с игроками.
     */
    constructor(playersManager) {
        this.playersManager = playersManager;
        this.dailyTaskInterval = null; // Интервал для периодического обновления
        this.dailyTaskTimeout = null;  // Таймаут для запуска в указанное время
    }

    /**
     * Рассчитывает время до следующего запуска обновления в указанное время.
     * @param {string} targetTime - Целевое время в формате "HH:mm".
     * @returns {number} Количество миллисекунд до следующего запуска.
     */
    calculateTimeUntilNextRun(targetTime) {
        const [hours, minutes] = targetTime.split(":").map(Number);
        const now = new Date();

        const nextRun = new Date();
        nextRun.setUTCHours(hours, minutes, 0, 0);

        if (now >= nextRun) {
            nextRun.setUTCDate(nextRun.getUTCDate() + 1); // Перенос на следующий день
        }

        return nextRun - now;
    }

    /**
     * Запускает обновление ежедневных заданий через указанный интервал.
     * @param {number} intervalInMinutes - Интервал в минутах для обновления.
     */
    startDailyTaskUpdaterByInterval(intervalInMinutes = 1440) {
        const intervalInMilliseconds = intervalInMinutes * 60 * 1000;

        if (this.dailyTaskInterval) {
            clearInterval(this.dailyTaskInterval); // Очищаем предыдущий таймер
        }

        this.dailyTaskInterval = setInterval(async () => {
            console.log(`Running daily task update by interval...`);
            try {
                await this.playersManager.updateAllDailyTasks();
                console.log(`Daily tasks updated successfully.`);
            } catch (error) {
                console.error(`Error updating daily tasks:`, error);
            }
        }, intervalInMilliseconds);

        console.log(`Daily task updater started. Interval: ${intervalInMinutes} minutes.`);
    }

    /**
     * Запускает обновление ежедневных заданий в указанное время (например, 00:00 UTC).
     * @param {string} targetTime - Целевое время запуска в формате "HH:mm" (UTC).
     */
    startDailyTaskUpdaterAt(targetTime = "00:00") {
        const timeUntilNextRun = this.calculateTimeUntilNextRun(targetTime);

        console.log(`Next daily task update scheduled in ${timeUntilNextRun / 1000 / 60} minutes.`);

        // Устанавливаем таймер на первый запуск
        this.dailyTaskTimeout = setTimeout(async () => {
            console.log(`Running daily task update at ${targetTime} UTC...`);
            try {
                await this.playersManager.updateAllDailyTasks();
                console.log(`Daily tasks updated successfully.`);
            } catch (error) {
                console.error(`Error updating daily tasks:`, error);
            }

            // После первого запуска переключаемся на интервал 24 часа
            this.dailyTaskInterval = setInterval(async () => {
                console.log(`Running daily task update at ${targetTime} UTC...`);
                try {
                    await this.playersManager.updateAllDailyTasks();
                    console.log(`Daily tasks updated successfully.`);
                } catch (error) {
                    console.error(`Error updating daily tasks:`, error);
                }
            }, 24 * 60 * 60 * 1000); // 24 часа
        }, timeUntilNextRun);
    }

    /**
     * Останавливает запланированное обновление ежедневных заданий.
     */
    stopDailyTaskUpdater() {
        if (this.dailyTaskTimeout) {
            clearTimeout(this.dailyTaskTimeout);
            this.dailyTaskTimeout = null;
        }

        if (this.dailyTaskInterval) {
            clearInterval(this.dailyTaskInterval);
            this.dailyTaskInterval = null;
        }

        console.log(`Daily task updater stopped.`);
    }
}
