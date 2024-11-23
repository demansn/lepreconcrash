export class StateMachine {
    #states = {};
    #context = {};
    #dependencies = {};
    #statesConfigByName = {};

    constructor({owner, dependencies = {}, states = {}, context}) {
        this.owner = owner || this;
        this.#dependencies = dependencies;
        this.#states = {};
        this.#context = context
        this.currentState = null;

        for (const [name, config] of Object.entries(states)) {
            this.#statesConfigByName[name] = config
        }
    }

    #addStates(statesConfig) {
        for (const [name, config] of Object.entries(statesConfig)) {
            this.#states[name] = this.#createState(name, config);
        }
    }

    #createState(name, config) {
        if (this.#isClassConfig(config)) {
            return this.#createClassBasedState(name, { Class: config });
        } else if (config.Class) {
            return this.#createClassBasedState(name, config);
        } else if (typeof config === 'function') {
            return this.#createFunctionBasedState(name, config);
        }
        throw new Error(`Invalid state configuration for state: ${name}`);
    }

    #createClassBasedState(name, config) {
        const { Class, context = this.#context, ...rest } = config;

        const state = new Class({
            dependencies: this.#dependencies,
            name,
            context,
            owner: this.owner,
            ...rest
        });

        if (context) {
            for (const [key, value] of Object.entries(context)) {
                if (state[key]) {
                    throw new Error(`State already has a property named ${key}`);
                }

                state[key] = this.#dependencies.resolve(value);
            }
        }

        return state;
    }

    #isClassConfig(value) {
        return (
            typeof value === 'function' &&
            value.prototype &&
            value.prototype.constructor === value &&
            Object.getOwnPropertyNames(value.prototype).includes('constructor')
        );
    }

    #createFunctionBasedState(name, stateFn) {
        return {
            enter: stateFn.bind(this.owner),
            exit: () => {}
        };
    }

    async goTo(name) {
        if (this.currentState) {
            await this.#states[this.currentState].exit();
        }

        if (!this.#states[name] && this.#statesConfigByName[name]) {
            this.#states[name] = this.#createState(name, this.#statesConfigByName[name]);
        }

        if (!this.#states[name]) {
            throw new Error(`State ${name} not found`);
        }

        this.currentState = name;
        await this.#states[name].enter();
    }
}
