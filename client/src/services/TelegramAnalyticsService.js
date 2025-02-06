import TelegramAnalytics from '@telegram-apps/analytics'

export class TelegramAnalyticsService  {
    constructor() {
        try {
            TelegramAnalytics.init({
                token:TELEGRAM_ANALYTICS_TOKEN,
                appName:TELEGRAM_ANALYTICS_APP_NAME,
            });
        } catch (e) {
            console.error(e);
        }
    }
}
