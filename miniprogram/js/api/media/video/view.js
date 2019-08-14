module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = {
            button: new PIXI.Graphics(),
            arrow: new PIXI.Graphics()
        },
        title = new PIXI.Text('视频', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x999999
        }),
        line = new PIXI.Graphics();
    goBack.button.position.set(0, 52 * Math.ceil(PIXI.ratio));
    goBack.button
        .beginFill(0xffffff, 0)
        .drawRect(0, 0, 80 * PIXI.ratio, 80 * PIXI.ratio)
        .endFill();
    goBack.arrow
        .lineStyle(5 * PIXI.ratio, 0x333333)
        .moveTo(50 * PIXI.ratio, 20 * PIXI.ratio)
        .lineTo(30 * PIXI.ratio, 40 * PIXI.ratio)
        .lineTo(50 * PIXI.ratio, 60 * PIXI.ratio);

    title.position.set((obj.width - title.width) / 2, 180 * PIXI.ratio);

    line.beginFill(0x999999)
        .drawRect(0, 0, title.width, 1 * PIXI.ratio)
        .endFill();
    line.position.set((obj.width - title.width) / 2, title.y + title.height + 10 * PIXI.ratio);

    goBack.button.interactive = true;
    goBack.button.touchend = () => {
        window.router.goBack();
    };

    goBack.button.addChild(goBack.arrow);
    container.addChild(goBack.button, title, line);
    let visible = (container.visible = false);
    app.stage.addChild(container);

    Object.defineProperty(container, 'visible', {
        get() {
            return visible;
        },
        set(value) {
            visible = value;
            if (visible) {
                callBack({
                    status: 'createVideo',
                    data: {
                        x: 0,
                        y: line.y / PIXI.ratio,
                        width: obj.width / (PIXI.ratio * 2),
                        height: 200 * (obj.width / (PIXI.ratio * 600))
                    }
                });
            } else {
                callBack({
                    status: 'destroy'
                });
            }
        }
    });
    return container;
};
