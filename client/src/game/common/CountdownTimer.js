import {EventEmitter} from "@pixi/utils";

// default time now + 24 hours
const DEFAULT_NEXT_UPDATE_TIME = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

export class CountdownTimer extends EventEmitter {
    /**
     * Конструктор таймера обратного отсчета.
     * @param {string} nextUpdateTime - Время следующего обновления в формате UTC ISO.
     */
    constructor(nextUpdateTime = DEFAULT_NEXT_UPDATE_TIME) {
        super();
        this.nextUpdateTime = new Date(nextUpdateTime);
        this.interval = null;
        this.start();
    }

    /**
     * Запуск таймера.
     */
    start() {
        if (this.interval) return;

        this.interval = setInterval(() => {
            const timeLeft = this.getTimeLeft();

            this.emit('tick', timeLeft);

            if (timeLeft === '00:00:00') {
                clearInterval(this.interval);
                this.interval = null;
                this.emit('end');
            }
        }, 1000);
    }

    /**
     * Остановка таймера.
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    /**
     * Получить оставшееся время в формате HH:mm:ss.
     * @returns {string} Время в формате HH:mm:ss.
     */
    getTimeLeft() {
        const now = new Date();
        const diff = this.nextUpdateTime - now;

        if (diff <= 0) return '00:00:00';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return [hours, minutes, seconds]
            .map(unit => String(unit).padStart(2, '0'))
            .join(':');
    }
}
