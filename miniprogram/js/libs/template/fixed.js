import { p_goBackBtn, p_line, p_text, p_img } from '../component/index';
module.exports = function(PIXI, { obj, title, api_name, underline = true }) {
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    let goBack, logo, logoName, desc;

    goBack = p_goBackBtn(PIXI, 'navigateBack');

    title &&
        (title = p_text(PIXI, {
            content: title,
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            // y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            y: menuButtonInfo.top * PIXI.ratio * 2,
            relative_middle: { containerWidth: obj.width }
        }));

    api_name &&
        (api_name = p_text(PIXI, {
            content: api_name,
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            y: title.height + title.y + 78 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }));

    underline &&
        (underline = p_line(
            PIXI,
            {
                width: PIXI.ratio | 0,
                color: 0xd8d8d8
            },
            [(obj.width - 150 * PIXI.ratio) / 2, api_name.y + api_name.height + 23 * PIXI.ratio],
            [150 * PIXI.ratio, 0]
        ));

    logo = p_img(PIXI, {
        width: 36 * PIXI.ratio,
        x: 288 * PIXI.ratio,
        y: obj.height - 66 * PIXI.ratio,
        src: 'images/logo.png'
    });

    logoName = p_text(PIXI, {
        content: '小游戏示例',
        fontSize: 26 * PIXI.ratio,
        fill: 0x576b95,
        y: (obj.height - 62 * PIXI.ratio) | 0,
        relative_middle: { point: 401 * PIXI.ratio }
    });

    return {
        goBack,
        title,
        api_name,
        underline,
        logo,
        logoName,
    };
};
