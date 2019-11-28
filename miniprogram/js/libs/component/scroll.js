import Scroller from '../Scroller/index';
module.exports = function(PIXI, deploy = {}) {
    let { width = canvas.width, height = 0, x = (canvas.width - width) / 2, y = 0 } = deploy;

    function Scroll() {
        let container = new PIXI.Container(),
            mask = new PIXI.Graphics();

        mask.beginFill(0xffffff)
            .drawRect(0, 0, width, height)
            .endFill();

        container.mask = mask;

        this.totalHeight = 0;

        this.myAddChildFn = function(itemArr, css = {}) {
            let { prevDist = 0, left = 0, top = 0 } = css,
                prevSpace = 0,
                len = container.children.length;
            if (prevDist && len) {
                prevSpace = container.children[len - 1].y + container.children[len - 1].height;
            }
            for (let i = 0, len = itemArr.length; i < len; i++) {
                itemArr[i].position.set(left + itemArr[i].x, top + prevSpace + prevDist + itemArr[i].y);
                this.totalHeight = prevSpace + prevDist + itemArr[i].y + itemArr[i].height;
                prevSpace && (prevSpace = itemArr[i].y + itemArr[i].height);
            }
            container.addChild(...itemArr);
            this.scroller.setDimensions(width, height, width, this.totalHeight);
        };

        this.isTouchable = function(boolean) {
            this.interactive = boolean;
        };

        this.scroller = new Scroller(
            (...args) => {
                container.position.y = -args[1];
            },
            {
                scrollingX: false,
                scrollingY: true,
                bouncing: false
            }
        );

        let touchstart = false;

        this.touchstart = e => {
            let data = e.data;
            this.scroller.doTouchStart(
                [
                    {
                        pageX: data.global.x,
                        pageY: data.global.y
                    }
                ],
                data.originalEvent.timeStamp
            );
            touchstart = true;
        };

        this.touchmove = e => {
            if (!touchstart) return;
            let data = e.data;
            this.scroller.doTouchMove(
                [
                    {
                        pageX: data.global.x,
                        pageY: data.global.y
                    }
                ],
                data.originalEvent.timeStamp
            );
            touchstart = true;
        };

        this.touchend = e => {
            if (!touchstart) return;
            let data = e.data;
            this.scroller.doTouchEnd(data.originalEvent.timeStamp);
            touchstart = false;
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
