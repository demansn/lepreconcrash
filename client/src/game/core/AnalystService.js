export class AnalystService {
    constructor() {
        if (TELEMETREE_PROJECT_ID && TELEMETREE_API_KEY && telemetree) {
            const telemetreeBuilder = telemetree({
                projectId: TELEMETREE_PROJECT_ID,
                apiKey: TELEMETREE_API_KEY,
                appName: "Leppi GO",
                isTelegramContext: true,
            });

            telemetreeBuilder.track('test', {});
        }
    }

    create() {

    }
}
