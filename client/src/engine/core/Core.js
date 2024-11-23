import DependencyContainer from "../../game/core/DependencyContainer.js";

class Core {
    constructor(config) {
        this.config = config;
        this.dependencies = new DependencyContainer();

        this.config.systems.forEach(systemConfig => {

        });
    }

    registerDependency(key, instance) {
        this.dependencies.register(key, instance);
    }
}
