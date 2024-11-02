import dotenv from 'dotenv';

dotenv.config();

export function createBuildSettings(options) {
    return {
        entryPoints: [
            'src/index.js',
        ],
        jsxDev: true,
        jsx: 'automatic',
        loader: {
            '.jsx': 'jsx',
            '.js': 'jsx'
        },
        outfile: 'dist/js/index.js',
        define: {
            'API_URL':  JSON.stringify(process.env.API_URL),
            'ENV':  JSON.stringify(process.env.ENV),
            'USER_DATA':  JSON.stringify(process.env.USER_DATA),
        },
        bundle: true,
        ...options
    };
}
