
class PixiAction {
  constructor(container, { scene }) {
    this.pixiApp = container.resolve('pixiApplication').getApp();
    this.scene = scene;
  }

  execute() {
    this.pixiApp.stage.addChild(this.scene);
  }
}

export default PixiAction;
        