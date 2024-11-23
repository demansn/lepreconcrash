import DependencyContainer from "./DependencyContainer.js";

export class Core {
    constructor(config) {
        this.config = config;
        this.dependencies = new DependencyContainer();

        this.config.systems.forEach(({System, name})=> {
            const system = new System(this.dependencies);
            this.dependencies.register(name, system);
        });
    }

    async run(systemsOptions) {
        for (const {name} of this.config.systems) {
            const system = this.dependencies.resolve(name);

            if (system.create) {
                const options =  systemsOptions[name];

                console.log('Creating system', name);

                await system.create(options);
            }
        }

        for (const {name} of this.config.systems) {
            const system = this.dependencies.resolve(name);

            if (system.start) {
                console.log('Starting system', name);
                system.start();
            }
        }
    }
}
