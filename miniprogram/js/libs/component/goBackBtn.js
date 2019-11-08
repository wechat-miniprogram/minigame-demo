import line from './line';
module.exports = function(PIXI, type, callBack) {
    function GoBackBtn() {
        this.beginFill(0xffffff, 0)
            .drawRoundedRect(0, 0, 80 * PIXI.ratio, 80 * PIXI.ratio, 0)
            .endFill();
        this.position.set(0, 52 * Math.ceil(PIXI.ratio));

        this.addChild(
            line(
                PIXI,
                {
                    width: 5 * PIXI.ratio,
                    color: 0x333333
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
                    callBack && callBack();
                    window.router[type]();
                }
            };
            e.recordY = e.data.global.y;
        };
    }
    GoBackBtn.prototype = new PIXI.Graphics();
    return new GoBackBtn();
};
