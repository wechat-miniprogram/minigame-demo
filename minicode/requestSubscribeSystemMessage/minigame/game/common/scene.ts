import { TinyEmitter } from '../libs/tinyemitter';

interface SceneData {
  title: string;
  explanation?: string;
  buttons?: { name: string; callback: () => void }[];
  exposed?: () => void;
  destroyed?: () => void;
}

class Scene extends TinyEmitter {
  private _scenes = [] as SceneData[];

  private _currentIndex = 0;

  init(data: SceneData[]) {
    this._scenes = data;
    this.emit('sceneChanged');
    this.currentScene.exposed?.();
  }

  get currentIndex() {
    return this._currentIndex;
  }

  get currentScene() {
    return this._scenes[this._currentIndex];
  }

  nextScene() {
    this.currentScene.destroyed?.();
    this._currentIndex += 1;
    if (this._currentIndex > this._scenes.length - 1) {
      this._currentIndex = 0;
    }
    this.emit('sceneChanged');
    this.currentScene.exposed?.();
  }

  preScene() {
    this.currentScene.destroyed?.();
    this._currentIndex -= 1;
    if (this._currentIndex < 0) {
      this._currentIndex = this._scenes.length - 1;
    }
    this.emit('sceneChanged');
    this.currentScene.exposed?.();
  }
}

export const scene = new Scene();
