import dotenv from 'dotenv';

dotenv.config();

export function createBuildSettings(options) {
    return {
        entryPoints: [
            'src/main.js',
        ],
        jsx: 'automatic',
        loader: {
            '.jsx': 'jsx',
            '.js': 'jsx'
        },
        outfile: 'dist/js/main.js',
        define: {
            'TELEGRAM_GAME_URL':  JSON.stringify(process.env.TELEGRAM_GAME_URL),
            'API_URL':  JSON.stringify(process.env.API_URL),
            'ENV':  JSON.stringify(process.env.ENV),
            'USER_DATA':  JSON.stringify(process.env.USER_DATA),
            'TELEMETREE_PROJECT_ID':  JSON.stringify(process.env.TELEMETREE_PROJECT_ID),
            'TELEMETREE_API_KEY':  JSON.stringify(process.env.TELEMETREE_API_KEY),
            'TELEMETREE_APP_NAME':  JSON.stringify(process.env.TELEMETREE_APP_NAME),
        },
        bundle: true,
        ...options
    };
}
