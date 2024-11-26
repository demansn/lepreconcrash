import http from 'node:http';

export class HTTPServer {
    constructor(options) {
        this.server = null;
        this.port = null;
        this.options = options;
        this.apis = [];
    }

    addAPI(api) {
        this.apis.push(api);
    }

    async requestHandler(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        const url = req.url;
        const method = req.method;

        if (method === 'OPTIONS') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('ok');
            return;
        }

        if (method === 'POST') {
            const functionName = url.replace('/', '');

            for (const api of this.apis) {
                if (api[functionName] && typeof api[functionName] === 'function') {
                    const handler = api[functionName].bind(api);

                    this.handlePOSTRequest(req, res, handler);
                    return;
                }
            }
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Endpoint not found');
    }

    handlePOSTRequest(req, res, handler) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    let data = JSON.parse(body || '[]');

                    if (!Array.isArray(data)) {
                        data = [data];
                    }

                    const result = await handler(...data);

                    if (!result) {
                        throw new Error('No result');
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                } catch (error) {
                    if (error.gameError) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: error.message, name: error.name }));
                        return;
                    }

                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Server error'}));

                    console.error(error);
                }
            });
    }

    start({ port }) {
        this.server = http.createServer(this.requestHandler.bind(this));
        this.server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }

    stop() {
        this.server.close();
    }
}
