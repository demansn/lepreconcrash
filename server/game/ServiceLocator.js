export class ServiceLocator {
    constructor() {
        this.services = {};
    }

    set(name, service) {
        if (this.services[name]) {
            throw new Error(`Service with name ${name} already exists`);
        }

        this.services[name] = service;
    }

    get(name) {
        if (!this.services[name]) {
            throw new Error(`Service with name ${name} not found`);
        }

        return this.services[name];
    }

    static get(name) {
        return ServiceLocator.getInstance().get(name);
    }

    static getInstance() {
        if (!ServiceLocator.instance) {
            ServiceLocator.instance = new ServiceLocator();
        }

        return ServiceLocator.instance;
    }
}
