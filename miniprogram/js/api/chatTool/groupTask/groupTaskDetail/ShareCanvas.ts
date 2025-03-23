export class ShareCanvas {
  public sharedCanvasShowed = false;
  public openDataContext: any;
  public sharedCanvas: any;
  public info: any;
  public imgY: number;
  public GAME_WIDTH: number;
  public GAME_HEIGHT: number;
  public initSharedWidth: number;
  public initSharedHeight: number;
  public sharedWidth: number;
  public sharedHeight: number;
  public texture: any;
 
  constructor( width, height, times, imgY ) {
      this.openDataContext = wx.getOpenDataContext();
      this.sharedCanvas    = this.openDataContext.canvas;
      this.info            = wx.getSystemInfoSync();
      this.imgY          = imgY || 0;
      this.GAME_WIDTH    = this.info.windowWidth * this.info.pixelRatio;
      this.GAME_HEIGHT   = this.info.windowHeight * this.info.pixelRatio;

      this.initSharedWidth  = this.sharedWidth  = ( width  ||  960 );
      this.initSharedHeight = this.sharedHeight = ( height ||  1410 );

      this.init(times);
  }

  init(times) {
      // 中间挖了个坑用填充排行榜
      this.sharedCanvas.width  = this.initSharedWidth;
      this.sharedCanvas.height = this.initSharedHeight;

      // 屏幕适配
      let temp = this.initSharedHeight / this.initSharedWidth;
      this.sharedWidth  = this.GAME_WIDTH * ( times || 0.85 );
      this.sharedHeight = temp * this.sharedWidth;

      this.updateSubViewPort(this.sharedWidth, this.sharedHeight);
  }

  updateSubViewPort(width, height) {
      // 计算排行榜占据的物理尺寸
      const realWidth  = width / this.GAME_WIDTH * this.info.windowWidth;
      const realHeight = height / this.GAME_HEIGHT * this.info.windowHeight;

      this.openDataContext.postMessage({
          event: 'updateViewPort',
          box       : {
              width  : realWidth,
              height : realHeight,
              x      : ( this.info.windowWidth - realWidth ) / 2,
              y      : (this.imgY / this.info.pixelRatio) || ( this.info.windowHeight - realHeight ) / 2,
          }
      });
  }

  renderSharedCanvas(PIXI, app) {
      !this.texture && (this.texture = PIXI.Texture.fromCanvas(this.sharedCanvas));
      this.texture.update();
      let shared = new PIXI.Sprite(this.texture);
      shared.name = 'shared';

      shared.width = this.sharedWidth;
      shared.height = this.sharedHeight;

      shared.x = this.GAME_WIDTH / 2 - shared.width / 2;
      shared.y = this.imgY ||  this.GAME_HEIGHT / 2 - shared.height / 2;

      app.stage.addChild(shared);
  }

  rankTiker(PIXI, app) {
       // 每一帧都先清除子域
      let sub = app.stage.getChildByName('shared');
      sub && app.stage.removeChild(sub);

      // 如果需要展示好友排行榜，将最新的子域绘制出来
      if ( this.sharedCanvasShowed ) {
          this.renderSharedCanvas(PIXI, app);
      }
  }
}
