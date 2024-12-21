import {TelemetreeClient} from "@tonsolutions/telemetree-node";
import {Provider} from "../../shared/AnalystService.js";

export class ServerTelemetreeProvider extends Provider {

    async initialize({projectId, apiKey}) {
        this.telemetree = new TelemetreeClient(
            projectId,
            apiKey
        );
        await this.telemetree.initialize();
    }

    async track(event, data) {
        if (this.telemetree) {
            this.telemetree.track({
                event_type:event,
                event_data: {
                   ...data
                }
            });
        }
    }

    async trackUpdate(message) {
        try {
            // Track the update
            // const response = await this.telemetree.trackUpdate(message);
        } catch (error) {
            console.error('Failed to track message:', error);
        }
    }
}
