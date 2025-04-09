import line from './line';
module.exports = function(PIXI, type, callBack) {
    function GoBackBtn() {
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
        this.beginFill(0xffffff, 0)
            .drawRoundedRect(0, 0, 80 * PIXI.ratio, 80 * PIXI.ratio, 0)
            .endFill();
        // this.position.set(0, 52 * Math.ceil(PIXI.ratio));
        this.position.set(0, menuButtonInfo.top * PIXI.ratio * 2 - 22 * PIXI.ratio); // 根据menuButtonInfo计算位置
        this.addChild(
            line(
                PIXI,
                {
                    width: 5 * PIXI.ratio,
                    color: +(type.split(':')[1] || 0x333333)
                },
                [41 * PIXI.ratio, 20 * PIXI.ratio],
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
