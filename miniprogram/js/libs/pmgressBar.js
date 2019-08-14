module.exports = function(PIXI, app, obj) {
    let container = new PIXI.Container(),
        pmgressBar = {
            gray: new PIXI.Graphics(),
            green: new PIXI.Graphics(),
            text: new PIXI.Text('分包正在玩命加载中...', {
                fontSize: `${28 * PIXI.ratio}px`,
                fill: 0x999999
            })
        };

    pmgressBar.gray
        .beginFill(0x999999)
        .drawRect(0, 0, (obj.width * 9) / 11, 5 * PIXI.ratio)
        .endFill();
    pmgressBar.gray.position.set(obj.width / 11, (obj.height - pmgressBar.gray.height) / 2);
    pmgressBar.green
        .beginFill(0x07c160)
        .drawRect(0, 0, pmgressBar.gray.width, pmgressBar.gray.height)
        .endFill();
    pmgressBar.green.position.set(pmgressBar.gray.x, pmgressBar.gray.y);
    pmgressBar.green.width = 0;

    pmgressBar.text.position.set(
        (obj.width - pmgressBar.text.width) / 2,
        pmgressBar.gray.y + pmgressBar.gray.height + 10 * PIXI.ratio
    );

    container.addChild(pmgressBar.gray, pmgressBar.green, pmgressBar.text);
    app.stage.addChild(container);
    return function(int_iPos) {
        if (!container) return;
        pmgressBar.green.width = (pmgressBar.gray.width / 100) * int_iPos;
        if (int_iPos === 100) {
            container.visible = false;
            app.stage.removeChild(container);
            container.destroy(true);
            container = null;
        }
    };
};
