import Scroller from "../Scroller/index";
module.exports = function (PIXI, deploy = {}) {
  let {
    width = canvas.width,
    height = 0,
    x = (canvas.width - width) / 2,
    y = 0,
  } = deploy;

  function Scroll() {
    let container = new PIXI.Container(),
      mask = new PIXI.Graphics();

    mask.beginFill(0xffffff).drawRect(0, 0, width, height).endFill();

    container.mask = mask;

    this.myAddChildFn = function (...itemArr) {
      container.addChild(...itemArr);
      this.scroller.contentSize(width, height, width, container.height);
    };

    this.myRemoveChildrenFn = function (beginIndex, endIndex) {
      container.removeChildren(beginIndex, endIndex);
      this.scroller.contentSize(width, height, width, container.height);
    };

    this.isTouchable = function (boolean) {
      this.interactive = boolean;
    };

    this.scroller = new Scroller((...args) => {
      this.monitor && this.monitor(-args[1]);
      container.position.y = -args[1];
    });

    this.touchstart = (e) => {
      e.stopPropagation();
      this.scroller.doTouchStart(e.data.global.x, e.data.global.y);
    };

    this.touchmove = (e) => {
      e.stopPropagation();
      this.scroller.doTouchMove(
        e.data.global.x,
        e.data.global.y,
        e.data.originalEvent.timeStamp
      );
    };

    this.touchend = (e) => {
      e.stopPropagation();
      this.scroller.doTouchEnd(e.data.originalEvent.timeStamp);
    };

    this.isTouchable(true);

    for (let i = 0, arr = ["width", "height"], len = arr.length; i < len; i++) {
      Object.defineProperty(this, arr[i], {
        get() {
          return mask[arr[i]];
        },
      });
    }

    this.addChild(container, mask);
    this.position.set(x, y);
  }

  Scroll.prototype = new PIXI.Container();

  return new Scroll();
};
