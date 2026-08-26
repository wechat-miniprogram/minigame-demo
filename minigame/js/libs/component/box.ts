module.exports = function(PIXI, deploy = {}) {
    let {
        width = canvas.width,
        height = 0,
        parentWidth = canvas.width,
        background = {
            color: 0xffffff,
            alpha: 1
        },
        border = {
            width: 0,
            color: 0xffffff,
            alpha: 1
        },
        x = (parentWidth - width) / 2,
        y = 0,
        radius = 0
    } = deploy;

    function Box() {
        this.lineStyle(border.width, border.color, border.alpha).beginFill(background.color, background.alpha);
        this[radius ? 'drawRoundedRect' : 'drawRect'](0, 0, width, height, radius).endFill();

        this.position.set(x, y);

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

        this.turnColors = function(deploy = {}) {
            let { background: newBackground, border: newBorder } = deploy;

            newBackground = Object.assign({}, background, newBackground);
            newBorder = Object.assign({}, border, newBorder);

            this.clear();

            this.lineStyle(newBorder.width, newBorder.color, newBorder.alpha)
                .beginFill(newBackground.color, newBackground.color)
                .drawRoundedRect(0, 0, width, height, radius)
                .endFill();
        };

        this.hideFn = function() {
            this.visible = false;
        };
        this.showFn = function() {
            this.visible = true;
        };
    }
    Box.prototype = new PIXI.Graphics();
    return new Box();
};
