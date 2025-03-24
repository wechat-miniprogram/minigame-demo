import { CreateShareCanvasOption } from "../types";

export class ShareCanvas {
  public sharedCanvasShowed = false;
  public openDataContext: any;
  public sharedCanvas: any;

  public texture: any;

  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public pixelRatio: number;
  public scale: number;

  //均为设计稿尺寸，由scale控制屏幕适配
  constructor(option: CreateShareCanvasOption) {
    const { width, height, x, y, pixelRatio, scale } = option;
    this.openDataContext = wx.getOpenDataContext();
    this.sharedCanvas = this.openDataContext.canvas;

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.pixelRatio = pixelRatio;
    this.scale = scale || 1;

    this.init();
  }

  r(value: number) {
    return value * this.scale;
  }

  init() {
    // 物理像素，设置sharedCanvas尺寸
    this.sharedCanvas.width = this.r(this.width * this.pixelRatio);
    this.sharedCanvas.height = this.r(this.height * this.pixelRatio);

    // 逻辑像素，同步给Layout，用于触摸事件
    this.openDataContext.postMessage({
      event: 'updateViewPort',
      box: {
        width: this.r(this.width),
        height: this.r(this.height),
        x: this.r(this.x),
        y: this.r(this.y),
      }
    });
  }

  renderSharedCanvas(PIXI, app) {
    !this.texture && (this.texture = PIXI.Texture.fromCanvas(this.sharedCanvas));
    this.texture.update();
    let shared = new PIXI.Sprite(this.texture);
    shared.name = 'shared';

    // 物理像素，使用PIXI渲染
    shared.width = this.r(this.width * this.pixelRatio);
    shared.height = this.r(this.height * this.pixelRatio);
    // 注意，偏移量只需要在这里加一次
    shared.x = this.r(this.x * this.pixelRatio);
    shared.y = this.r(this.y * this.pixelRatio);

    app.stage.addChild(shared);
  }

  rankTiker(PIXI, app) {
    // 每一帧都先清除子域
    let sub = app.stage.getChildByName('shared');
    sub && app.stage.removeChild(sub);

    // 如果需要展示好友排行榜，将最新的子域绘制出来
    if (this.sharedCanvasShowed) {
      this.renderSharedCanvas(PIXI, app);
    }
  }
}
