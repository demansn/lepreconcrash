
import SceneManager from './systems/SceneManager.js';
import ApiService from './systems/ApiService.js';
import PixiApplication from './systems/PixiApplication.js';

const config = {
  components: {
    sceneManager: { type: SceneManager },
    apiService: { type: ApiService },
    pixiApplication: { type: PixiApplication, options: { width: 1024, height: 768, options: { backgroundColor: 0x1099bb } } }
  },
  states: {
    gameInit: {
      actions: [
        { type: 'ApiAction', method: 'init', args: [], resultKey: 'initData' },
        { type: 'SceneAction', sceneName: 'gameScene', methodName: 'show' },
        { type: 'SceneAction', sceneName: 'gameScene', methodName: 'init', argsKeys: ['initData'] }
      ]
    }
  }
};

export default config;
