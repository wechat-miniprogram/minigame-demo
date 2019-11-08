module.exports = function(PIXI, deploy = {}) {
    let {
        radius = 0,
        background = {
            color: 0xffffff,
            alpha: 1
        },
        border = {
            width: 0,
            color: 0xffffff,
            alpha: 1
        },
        x = radius,
        y = radius
    } = deploy;

    function Circle() {
        this.lineStyle(border.width, border.color, border.alpha)
            .beginFill(background.color, background.alpha)
            .drawCircle(0, 0, radius)
            .endFill();

        (this.setPositionFn = function(deploy = {}) {
            deploy = Object.assign({ x, y }, deploy);
            this.position.set(deploy.x, deploy.y);
        }).call(this);

        this.onClickFn = function(callBack) {
            this.interactive = true;
            this.touchstart = e => {
                e.currentTarget.touchend = e => {
                    e.target.touchend = null;
                    if (Math.abs(e.recordY - e.data.global.y) < 5) {
                        callBack(e);
                    }
                };
                e.recordY = e.data.global.y;
            };
        };

        this.onTouchMoveFn = function(callBack) {
            this.interactive = true;
            this.touchstart = e => {
                e.currentTarget.touchmove = e => {
                    callBack(e);
                };
            };
        };

        this.turnColors = function(deploy = {}) {
            let { background: newBackground, border: newBorder } = deploy;

            newBackground = Object.assign({}, background, newBackground);
            newBorder = Object.assign({}, border, newBorder);

            this.clear();
            this.lineStyle(newBorder.width, newBorder.color, newBorder.alpha)
                .beginFill(newBackground.color, newBackground.alpha)
                .drawCircle(0, 0, radius)
                .endFill();
        };
    }
    Circle.prototype = new PIXI.Graphics();
    return new Circle();
};
