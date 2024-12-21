import {Provider} from "../../../shared/AnalystService.js";

export class TelemetreeProvider extends Provider {
    async initialize(options) {
        super.initialize();

        if (options.projectId && options.apiKey && options.appName && telemetree) {
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
