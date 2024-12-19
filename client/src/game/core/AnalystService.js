export class AnalystService {
    constructor() {
        if (TELEMETREE_PROJECT_ID && TELEMETREE_API_KEY && telemetree && TELEMETREE_APP_NAME) {
            const telemetreeBuilder = telemetree({
                projectId: TELEMETREE_PROJECT_ID,
                apiKey: TELEMETREE_API_KEY,
                appName: TELEMETREE_APP_NAME,
                isTelegramContext: true,
            });

            telemetreeBuilder.track('test', {});
        }
    }

    create() {

    }
}
