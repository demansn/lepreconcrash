export class Provider {
    track(event, data) {}
    async initialize() {}
}

export class AnalystService {
    constructor() {
        /**
         * @type {Provider[]}
         */
        this.providers = [];
        this.providersByName = {};
    }

    async create({providers = []}) {
        for (const {name, Constructor, options} of providers) {
            this.providers.push(new Constructor());
            this.providersByName[name] = this.providers[this.providers.length - 1];
            await this.providers[this.providers.length - 1].initialize(options);
        }
    }

    async track(event, data) {
         for (const provider of this.providers) {
             await provider.track(event, data);
         }
    }

    getProvider(name) {
        return this.providersByName[name];
    }
}
