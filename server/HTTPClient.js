import http from 'node:http';

export class HTTPServer {
    constructor() {
        this.server = null;
        this.port = null;
    }

    setAPI(api) {
        this.api = api
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

                if (this.api[functionName] && typeof this.api[functionName] === 'function') {
                    const handler = this.api[functionName];

                    this.handlePOSTRequest(req, res, handler.bind(this.api));
                    return;
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
                    const data = JSON.parse(body || '[]');
                    const result = await handler(...data);

                    if (!result) {
                        throw new Error('No result');
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: error.message }));
                }
            });
    }

    start({ port }) {
        this.server = http.createServer(this.requestHandler.bind(this));
        this.server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}
