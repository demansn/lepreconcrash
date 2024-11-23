
class SceneAction {
  constructor(container, { sceneName, methodName, argsKeys = [] }) {
    this.sceneManager = container.resolve('sceneManager');
    this.sceneName = sceneName;
    this.methodName = methodName;
    this.argsKeys = argsKeys;
  }

  async execute(result) {
    const args = this.argsKeys.map(key => result[key]);
    this.sceneManager[this.methodName](...args);
  }
}

export default SceneAction;
        