import * as TweenMax from '../TweenMax.min';
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
        };

        this.isTouchable = function(boolean) {
            this.interactive = boolean;
        };

        var mousedown = false;
        var lastPos = null;
        var lastDiff = null;
        var scrollTween = null;
        this.isTouchable(true);
        this.touchmove = function(e) {
            var clientY = e.data.global.y;
            if (mousedown) {
                lastDiff = clientY - lastPos.y;
                lastPos.y = clientY;

                if (-container.y < 0) {
                    container.y += lastDiff / 2;
                } else {
                    container.y += lastDiff;
                }
            }
        };
        this.touchstart = function(e) {
            var clientY = e.data.global.y;
            mousedown = true;
            if (scrollTween) scrollTween.kill();
            lastPos = {
                y: clientY
            };
        };
        this.touchend = function() {
            var goY = container.y + lastDiff * 10,
                ease = 'Quad.easeOut',
                time = Math.abs(lastDiff / this.totalHeight);

            if (goY < -this.totalHeight + height) {
                goY = -this.totalHeight + height;
                ease = 'Back.easeOut';
                time = 0.1 + Math.abs(lastDiff / this.totalHeight);
            }
            if (goY > 0) {
                goY = 0;
                ease = 'Back.easeOut';
                time = 0.1 + Math.abs(lastDiff / this.totalHeight);
            }

            if (container.y > 0) {
                time = Math.abs(container.y / (height * 2));
                ease = 'Linear';
            }
            if (container.y < -this.totalHeight + height) {
                time = Math.abs(container.y / (height * 2));
                ease = 'Linear';
            }

            scrollTween = TweenMax.to(container, time, {
                y: goY,
                ease: ease
            });

            mousedown = false;
            lastPos = null;
            lastDiff = null;
        };

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
