module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = {
            button: new PIXI.Graphics(),
            arrow: new PIXI.Graphics()
        },
        title = new PIXI.Text('生成二维码', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x999999
        }),
        line = new PIXI.Graphics(),
        appletCode = null,
        button = new PIXI.Graphics(),
        text = new PIXI.Text('点击生成', {
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

    button.position.set(30 * PIXI.ratio, obj.height - 420 * PIXI.ratio);
    button
        .beginFill(0x07c160, 1)
        .drawRoundedRect(0, 0, obj.width - button.x * 2, 80 * PIXI.ratio, 10 * PIXI.ratio)
        .endFill();

    button.addChild(text);
    text.position.set((button.width - text.width) / 2, (button.height - text.height) / 2);

    function deleteSpriteFn() {
        if (appletCode) {
            container.removeChild(appletCode);
            appletCode.destroy(true);
            appletCode = null;
        }
    }

    button.interactive = true;
    button.touchend = () => {
        callBack(base64 => {
            deleteSpriteFn();
            appletCode = new PIXI.Sprite(PIXI.Texture.from(base64));
            appletCode.width = appletCode.height = 430 * PIXI.ratio;
            appletCode.position.set((obj.width - appletCode.width) / 2, line.y + line.height + 100 * PIXI.ratio);

            container.addChild(appletCode);
            button.visible = false;
        });
    };

    goBack.button.interactive = true;
    goBack.button.touchend = () => {
        window.router.goBack();
        button.visible = true;
        deleteSpriteFn();
    };

    goBack.button.addChild(goBack.arrow);
    container.addChild(goBack.button, title, line, button);

    container.visible = false;
    app.stage.addChild(container);

    return container;
};
