import {TelemetreeClient} from "@tonsolutions/telemetree-node";
import {Provider} from "../../shared/AnalystService.js";

export class ServerTelemetreeProvider extends Provider {
    async initialize({projectId, apiKey}) {
        this.options = {projectId, apiKey};
        await this.initSession();
    }

    async initSession() {
        const options = this.options;

        if (options.projectId && options.apiKey && !this.telemetree) {
            this.telemetree = new TelemetreeClient(options.projectId, options.apiKey);
            await this.telemetree.initialize();
        }
    }

    async track(event, data = {}) {
        if (this.telemetree) {
            try {
                await this.telemetree.track({
                    event_type: event,
                    event_data: {
                        ...data
                    }
                });
            } catch (error) {
                console.error(`Failed to track event: ${event}`, data, error);
            }
        }
    }

    async trackUpdate(message) {
        try {
            // Track the update
            const response = await this.telemetree.trackUpdate(message);
        } catch (error) {
            console.error('Failed to track message:', error);
        }
    }
}
