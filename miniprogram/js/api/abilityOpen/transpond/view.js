module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = {
            button: new PIXI.Graphics(),
            arrow: new PIXI.Graphics()
        },
        title = new PIXI.Text('转发', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x999999
        }),
        line = new PIXI.Graphics(),
        explain = new PIXI.Text('被动转发\n请点击右上角菜单中的“转发”选项后\n会触发转发事件', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x999999,
            align: 'center'
        }),
        button = new PIXI.Graphics(),
        text = new PIXI.Text('点击此按钮主动转发 shareAppMessage', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0xffffff
        });
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

    explain.position.set((obj.width - explain.width) / 2, line.y + line.height + 300 * PIXI.ratio);

    button.position.set(30 * PIXI.ratio, explain.y + explain.height + 300 * PIXI.ratio);
    button
        .beginFill(0x07c160, 1)
        .drawRoundedRect(0, 0, obj.width - button.x * 2, 80 * PIXI.ratio, 10 * PIXI.ratio)
        .endFill();

    button.addChild(text);
    text.position.set((button.width - text.width) / 2, (button.height - text.height) / 2);

    button.interactive = true;
    button.touchend = () => {
        callBack({
            status: 'shareAppMessage'
        });
    };

    goBack.button.interactive = true;
    goBack.button.touchend = () => {
        window.router.goBack();
    };

    goBack.button.addChild(goBack.arrow);
    container.addChild(goBack.button, title, line, explain, button);
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
                    status: 'onShareAppMessage',
                    title: '您已经成功调起被动分享'
                });
                return;
            }

            callBack({
                status: 'offShareAppMessage'
            });
        }
    });
    return container;
};
