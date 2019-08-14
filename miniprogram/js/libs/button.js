module.exports = function(PIXI, deploy = {}) {
    let button = new PIXI.Graphics(),
        {
            width = canvas.width - 80 * PIXI.ratio,
            height = 94 * PIXI.ratio,
            color = 0x1aad19,
            border = {
                width: 0,
                color: 0xffffff,
                alpha: 0
            },
            x = (canvas.width - width) / 2,
            y = 0,
            radius = 10
        } = deploy;
    button
        .lineStyle(border.width, border.color, border.alpha)
        .beginFill(color)
        .drawRoundedRect(0, 0, width, height, radius)
        .endFill();
    button.position.set(x, y);
    return button;
};
