module.exports = function(PIXI, deploy: any = {}) {
    let {
        width = canvas.width - 80 * PIXI.ratio,
        height = 88 * PIXI.ratio,
        parentWidth = canvas.width,
        color = 0x07C160,
        alpha = 1,
        border = {
            width: 0,
            color: 0xffffff,
            alpha: 1
        },
        x = (parentWidth - width) / 2,
        y = 0,
        radius = 8 * PIXI.ratio
    } = deploy;

    function Button() {
        let kind = new PIXI.Graphics(),
            maskLayer = new PIXI.Graphics(),
            shape = radius ? 'drawRoundedRect' : 'drawRect';

        this.position.set(x, y);
        this.addChild(kind, maskLayer);

        kind.lineStyle(border.width, border.color, border.alpha).beginFill(color, alpha);
        kind[shape](0, 0, width, height, radius).endFill();

        maskLayer.lineStyle(border.width, 0x000000, 0.1).beginFill(0x000000, 0.1);
        maskLayer[shape](0, 0, width, height, radius).endFill();
        maskLayer.visible = false;

        this.onClickFn = function(callBack) {
            this.interactive = true;
            let recordY = 0;
            this.touchstart = e => {
                maskLayer.visible = true;
                recordY = e.data.global.y;
                
                const handleTouchEnd = e => {
                    if (Math.abs(recordY - e.data.global.y) < 5) {
                        callBack(e);
                    }
                };

                // 无触摸时，移除maskLayer
                const checkTouchEnd = () => {
                    if (!e.data.originalEvent.touches.length) {
                        maskLayer.visible = false;
                        PIXI.ticker.shared.remove(checkTouchEnd);
                    }
                };
                
                // 添加全局检查
                PIXI.ticker.shared.add(checkTouchEnd);
                
                // 保留原有的事件监听
                this.touchend = handleTouchEnd;
            };
        }.bind(kind);

        this.offClickFn = function() {
            this.interactive = false;
            this.touchstart = null;
        }.bind(kind);

        this.isTouchable = function(boolean) {
            this.interactive = boolean;
        }.bind(kind);

        this.turnColors = function(deploy: any = {}) {
            let { color: newColor, border: newBorder, alpha: newAlpha } = deploy;
            newBorder = Object.assign({}, border, newBorder);

            this.clear();
            this.lineStyle(newBorder.width, newBorder.color, newBorder.alpha)
                .beginFill(newColor || color, newAlpha || alpha)
                .drawRoundedRect(0, 0, width, height, radius)
                .endFill();
        }.bind(kind);

        this.myAddChildFn = function(...arr) {
            this.addChild(...arr);
        }.bind(kind);

        this.hideFn = function() {
            this.visible = false;
        };
        
        this.showFn = function() {
            this.visible = true;
        };
    }
    Button.prototype = new PIXI.Container();
    return new Button();
};
