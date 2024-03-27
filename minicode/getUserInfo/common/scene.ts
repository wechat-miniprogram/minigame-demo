import { TinyEmitter } from "../libs/tinyemitter";

class Screen extends TinyEmitter {
  public scenes = [
    {
      title: "首页场景",
      background: "#07c160",
    },
    {
      title: "其他场景",
      background: "#07c1a7",
    },
    {
      title: "结算场景",
      background: "#c17a07",
    },
  ];

  private _currentIndex = 0;

  constructor() {
    super();
    this.emit('sceneChanged')
  }

  get currentIndex() {
    return this._currentIndex;
  }

  get currentScene() {
    return this.scenes[this._currentIndex];
  }

  changeScene(index: number) {
    this._currentIndex = index;
  }

  nextScene() {
    this._currentIndex += 1;
    if (this._currentIndex > this.scenes.length - 1) {
      this._currentIndex = 0;
    }
    this.emit("sceneChanged");
  }

  preScene() {
    this._currentIndex -= 1;
    if (this._currentIndex < 0) {
      this._currentIndex = this.scenes.length - 1;
    }
    this.emit("sceneChanged");
  }
}

export const scene = new Screen();
