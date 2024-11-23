
class DependencyContainer {
  constructor() {
    this.dependencies = new Map();
  }

  register(key, instance) {
    this.dependencies.set(key, instance);
  }

  resolve(key) {
    if (!this.dependencies.has(key)) {
      throw new Error(`Dependency "${key}" not found`);
    }
    return this.dependencies.get(key);
  }
}

export default DependencyContainer;
        