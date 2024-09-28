import {EventEmitter} from "@pixi/utils";

export const app = {
    eventEmitter: new EventEmitter(),

    awaitEvent(eventName) {
        return new Promise((resolve) => {
            this.eventEmitter.once(eventName, resolve);
        });
    },

    version: true
};
