
class StateFactory {
  constructor(container) {
    this.container = container;
    this.actionRegistry = new Map();
  }

  registerAction(actionName, actionConstructor) {
    this.actionRegistry.set(actionName, actionConstructor);
  }

  createAction(actionConfig) {
    const { type, ...params } = actionConfig;
    const ActionConstructor = this.actionRegistry.get(type);
    if (!ActionConstructor) {
      throw new Error(`Action "${type}" not registered`);
    }
    return new ActionConstructor(this.container, params);
  }

  createState(stateName, stateTemplates) {
    const template = stateTemplates[stateName];
    if (!template) {
      throw new Error(`State template "${stateName}" not found`);
    }
    const actions = template.actions.map(config => this.createAction(config));
    return new GamePlayState(actions);
  }
}

export default StateFactory;
