import {Provider} from "../../../shared/AnalystService.js";

export class TelemetreeProvider extends Provider {
    async initialize(options) {
        super.initialize();

        this.options = options;
    }

    async initSession() {
        const options = this.options;

        if (options.projectId && options.apiKey && options.appName && telemetree && !this.telemetreeBuilder) {
            this.telemetreeBuilder = telemetree({
                ...options,
                isTelegramContext: true,
            });
        }
    }

    track(event, data) {
        if (this.telemetreeBuilder) {
            this.telemetreeBuilder.track(event, data);
        }
    }
}
