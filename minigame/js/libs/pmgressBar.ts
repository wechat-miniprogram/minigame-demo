export default function(PIXI, app, obj) {
    let container = new PIXI.Container(),
        pmgressBar = {
            gray: new PIXI.Graphics(),
            green: new PIXI.Graphics(),
            text: new PIXI.Text('分包正在玩命加载中...', {
                fontSize: `${28 * PIXI.ratio}px`,
                fill: 0x999999
            })
        };

    const barW = (obj.width * 9) / 11;
    const barH = 5 * PIXI.ratio;
    const barX = obj.width / 11;
    const barY = (obj.height - barH) / 2;

    pmgressBar.gray
        .beginFill(0x999999)
        .drawRect(0, 0, barW, barH)
        .endFill();
    pmgressBar.gray.position.set(barX, barY);

    // 绿色进度条：不预绘制完整矩形再缩放 width，
    // 而是每次更新时 clear + 重绘，避免移动端 scale 反向问题
    pmgressBar.green.position.set(barX, barY);

    pmgressBar.text.position.set(
        (obj.width - pmgressBar.text.width) / 2,
        barY + barH + 10 * PIXI.ratio
    );

    container.addChild(pmgressBar.gray, pmgressBar.green, pmgressBar.text);
    app.stage.addChild(container);
    return function(int_iPos) {
        if (!container) return;
        // 每次重绘绿色进度条，确保从左向右增长
        const greenW = (barW / 100) * int_iPos;
        pmgressBar.green.clear();
        if (greenW > 0) {
            pmgressBar.green.beginFill(0x07c160).drawRect(0, 0, greenW, barH).endFill();
        }
        if (int_iPos === 100) {
            container.visible = false;
            app.stage.removeChild(container);
            container.destroy(true);
            container = null;
        }
    };
};
