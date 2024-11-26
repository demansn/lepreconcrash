import {Container} from "pixi.js";

export class SceneManager{
  constructor(dependencies) {
    this.app = dependencies.resolve('PixiApplication');
  }

  create({scenes}) {
    this.container = new Container();
    this.scenes = {};
    this.scenesConfig = scenes;
    this.app.getStage().addChild(this.container);
  }

  #addScene(scene) {
    this.app.addChildToStage(scene);
  }

  #removeScene(scene) {
    this.container.removeChild(scene);
  }

  getScene(sceneName) {
    const Scene = this.scenesConfig[sceneName];

    if (!this.scenes[sceneName] && Scene) {
        this.scenes[sceneName] = new Scene(Scene.options);
    }

    if (!this.scenes[sceneName]) {
        throw new Error(`Scene ${sceneName} not found`);
    }

    return this.scenes[sceneName];
  }

  show(sceneName, parameters) {
    const scene = this.getScene(sceneName);

    this.#addScene(scene);

    scene.show(parameters);

    return scene;
  }

  call(sceneName, method, ...args) {
    const scene = this.getScene(sceneName);

    if (scene[method]) {
      return scene[method](...args);
    }
  }

  forEachScene(callback) {
    Object.values(this.scenes).forEach(callback);
  }

  callAll(method, ...args) {
    this.forEachScene(scene => {
      if (scene[method]) {
        scene[method](...args);
      }
    });
  }

  on(sceneName, event, callback) {
    const scene = this.getScene(sceneName);

    scene.on(event, callback);
  }

  offAll(sceneName, events) {
    const scene = this.getScene(sceneName);

    if (!events) {
        scene.off();
        return;
    } else if (!Array.isArray(events)) {
        events = [events];
    }

    events.forEach(event => scene.off(event));
  }

  hide(sceneName) {
    const scene = this.getScene(sceneName);

    this.#removeScene(scene);

    scene.hide();
  }
}
