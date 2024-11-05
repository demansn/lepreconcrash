
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
                        const result = await response.json();

                        if (result.error) {
                            reject(result.error);
                        } else {
                            resolve(result);
                        }
                    } else {
                        reject(response.statusText);
                    }
                });
            }
    });

    return  api;
}
