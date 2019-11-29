import { p_goBackBtn, p_line, p_text, p_img } from './index';
module.exports = function(PIXI, { title, api_name, underline, logo, logoName }) {
    goBack = p_goBackBtn(PIXI, 'delPage');
    title = p_text(PIXI, {
        content: title,
        fontSize: 36 * PIXI.ratio,
        fill: 0x353535,
        y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
        relative_middle: { containerWidth: canvas.width }
    });
    api_name = p_text(PIXI, {
        content: api_name,
        fontSize: 32 * PIXI.ratio,
        fill: 0xbebebe,
        y: title.height + title.y + 78 * PIXI.ratio,
        relative_middle: { containerWidth: canvas.width }
    });
    underline &&
        (underline = p_line(
            PIXI,
            {
                width: PIXI.ratio | 0,
                color: 0xd8d8d8
            },
            [(canvas.width - 150 * PIXI.ratio) / 2, api_name.y + api_name.height + 23 * PIXI.ratio],
            [150 * PIXI.ratio, 0]
        ));
    logo = p_img(PIXI, {
        width: 36 * PIXI.ratio,
        height: 36 * PIXI.ratio,
        x: 294 * PIXI.ratio,
        y: canvas.height - 66 * PIXI.ratio,
        src: logo
    });
    logoName = p_text(PIXI, {
        content: logoName,
        fontSize: 26 * PIXI.ratio,
        fill: 0x576b95,
        y: (canvas.height - 62 * PIXI.ratio) | 0,
        relative_middle: { point: 404 * PIXI.ratio }
    });

    return {
        title,
        api_name,
        underline,
        logo,
        logoName
    };
};
