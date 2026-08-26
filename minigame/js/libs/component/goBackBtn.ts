import line from './line';
module.exports = function(PIXI, type, callBack) {
    function GoBackBtn() {
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
        // 更大的点击热区，但背景透明
        this.beginFill(0xffffff, 0)
            .drawRoundedRect(0, 0, 88 * PIXI.ratio, 88 * PIXI.ratio, 0)
            .endFill();
        this.position.set(4 * PIXI.ratio, menuButtonInfo.top * PIXI.ratio * 2 - 22 * PIXI.ratio);
        // 返回箭头线条（使用 3px 宽度更精致）
        this.addChild(
            line(
                PIXI,
                {
                    width: 4 * PIXI.ratio,
                    color: +(type.split(':')[1] || 0x000000)
                },
                [44 * PIXI.ratio, 22 * PIXI.ratio],
                [-20 * PIXI.ratio, 20 * PIXI.ratio],
                [0, 40 * PIXI.ratio]
            )
        );

        (this.isTouchable = function(boolean) {
            this.interactive = boolean;
        }).call(this, true);

        this.touchstart = e => {
            e.currentTarget.touchend = e => {
                e.target.touchend = null;
                if (Math.abs(e.recordY - e.data.global.y) < 5) {
                    this.callBack && this.callBack();
                    window.router[type.split(':')[0]]();
                }
            };
            e.recordY = e.data.global.y;
        };

        this.callBack = callBack;
    }
    GoBackBtn.prototype = new PIXI.Graphics();
    return new GoBackBtn();
};
