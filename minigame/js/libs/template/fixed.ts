import { p_goBackBtn, p_line, p_text, p_img } from '../component/index';
module.exports = function(PIXI, { obj, title, api_name, underline = true }) {
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    let goBack, logo, logoName, desc;

    goBack = p_goBackBtn(PIXI, 'navigateBack');

    // 页面标题（--wx-size-title-0 = 22px → 44 设计稿，Regular 字重）
    title &&
        (title = p_text(PIXI, {
            content: title,
            fontSize: 36 * PIXI.ratio,
            fill: 0x000000,
            y: menuButtonInfo.top * PIXI.ratio * 2,
            relative_middle: { containerWidth: obj.width }
        }));

    // API 名称副标题（--wx-size-desc-0 = 14px → 28 设计稿，次文字色 --wx-fg-1）
    api_name &&
        (api_name = p_text(PIXI, {
            content: api_name,
            fontSize: 28 * PIXI.ratio,
            fill: 0x808080,
            y: title.height + title.y + 16 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }));

    // 分割线（在灰色背景上用更深一点的颜色）
    underline &&
        (underline = p_line(
            PIXI,
            {
                width: PIXI.ratio | 0,
                color: 0xD0D0D0
            },
            [(obj.width - 120 * PIXI.ratio) / 2, api_name.y + api_name.height + 32 * PIXI.ratio],
            [120 * PIXI.ratio, 0]
        ));

    // 底部 logo（--wx-link 色 = #576B95）
    logo = p_img(PIXI, {
        width: 36 * PIXI.ratio,
        x: 288 * PIXI.ratio,
        y: obj.height - 66 * PIXI.ratio,
        src: 'images/logo.png'
    });

    logoName = p_text(PIXI, {
        content: '小游戏示例',
        fontSize: 24 * PIXI.ratio,
        fill: 0x808080,
        y: (obj.height - 60 * PIXI.ratio) | 0,
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
