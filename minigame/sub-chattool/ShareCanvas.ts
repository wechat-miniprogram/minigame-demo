import { CreateShareCanvasOption } from './shared/types';

/**
 * 开放数据域画布封装
 * 用于在主域中渲染开放数据域的内容（如群成员排行榜）
 */
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

  /** 初始化 sharedCanvas 尺寸，并同步视口给开放数据域 */
  init() {
    this.sharedCanvas.width = this.r(this.width * this.pixelRatio);
    this.sharedCanvas.height = this.r(this.height * this.pixelRatio);

    this.openDataContext.postMessage({
      event: 'updateViewPort',
      box: {
        width: this.r(this.width),
        height: this.r(this.height),
        x: this.r(this.x),
        y: this.r(this.y),
      },
    });
  }

  /** 将 sharedCanvas 渲染为 PIXI Sprite */
  renderSharedCanvas(PIXI: any, app: any) {
    if (!this.texture) {
      this.texture = PIXI.Texture.fromCanvas(this.sharedCanvas);
    }
    this.texture.update();

    const shared = new PIXI.Sprite(this.texture);
    shared.name = 'shared';
    shared.width = this.r(this.width * this.pixelRatio);
    shared.height = this.r(this.height * this.pixelRatio);
    shared.x = this.r(this.x * this.pixelRatio);
    shared.y = this.r(this.y * this.pixelRatio);

    app.stage.addChild(shared);
  }

  /** 每帧刷新开放数据域画布（清除旧帧 → 绘制新帧） */
  rankTicker(PIXI: any, app: any) {
    const sub = app.stage.getChildByName('shared');
    sub && app.stage.removeChild(sub);

    if (this.sharedCanvasShowed) {
      this.renderSharedCanvas(PIXI, app);
    }
  }
}
