
export function createAPI(methods, path) {
    const api = {};

    methods.forEach((method) => {
        api[method] = async (...args) => {
            return new Promise(async (resolve, reject) => {
                const response = await fetch(`${path}/${method}`, {
                    method: 'POST',
                    headers: {
                            'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(args),
                });

                    if (response.ok) {
                        resolve(response.json());
                    } else {
                        reject(response.statusText);
                    }
                });
            }
    });

    return  api;
}
