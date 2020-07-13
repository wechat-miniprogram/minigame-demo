import Scroller from '../Scroller/index';
module.exports = function(PIXI, deploy = {}) {
    let { width = canvas.width, height = 0, x = (canvas.width - width) / 2, y = 0, monitor } = deploy;

    function Scroll() {
        let container = new PIXI.Container(),
            mask = new PIXI.Graphics();

        mask.beginFill(0xffffff)
            .drawRect(0, 0, width, height)
            .endFill();

        container.mask = mask;

        this.totalHeight = 0;

        this.myAddChildFn = function(...itemArr) {
            for (let i = 0, len = itemArr.length; i < len; i++) {
                this.totalHeight = Math.max(this.totalHeight, itemArr[i].y + itemArr[i].height);
            }
            container.addChild(...itemArr);
            this.scroller.setDimensions(width, height, width, this.totalHeight);
        };

        this.isTouchable = function(boolean) {
            this.interactive = boolean;
        };

        this.scroller = new Scroller(
            (...args) => {
                this.monitor && this.monitor(-args[1]);
                container.position.y = -args[1];
            },
            {
                scrollingX: false,
                scrollingY: true,
                bouncing: false
            }
        );

        let doTouchFn = function(e, name) {
            let data = e.data,
                touches = data.originalEvent.touches || data.originalEvent.targetTouches || data.originalEvent.changedTouches;
            touches[0].pageX = data.global.x;
            touches[0].pageY = data.global.y;
            this.scroller[name](touches, data.originalEvent.timeStamp);
        }.bind(this);

        this.touchstart = e => {
            doTouchFn(e, 'doTouchStart');
        };

        this.touchmove = e => {
            doTouchFn(e, 'doTouchMove');
        };

        this.touchend = e => {
            let data = e.data;
            this.scroller.doTouchEnd(data.originalEvent.timeStamp);
        };

        this.isTouchable(true);

        for (let i = 0, arr = ['width', 'height'], len = arr.length; i < len; i++) {
            Object.defineProperty(this, arr[i], {
                get() {
                    return mask[arr[i]];
                }
            });
        }

        this.addChild(container, mask);
        this.position.set(x, y);
    }

    Scroll.prototype = new PIXI.Container();

    return new Scroll();
};
