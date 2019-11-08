import { p_text, p_line, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        title = p_text(PIXI, {
            content: '主动转发',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'shareAppMessage',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            y: title.height + title.y + 78 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        underline = p_line(
            PIXI,
            {
                width: PIXI.ratio | 0,
                color: 0xd8d8d8
            },
            [(obj.width - 150 * PIXI.ratio) / 2, api_name.y + api_name.height + 23 * PIXI.ratio],
            [150 * PIXI.ratio, 0]
        ),
        prompt = p_text(PIXI, {
            content: '轻触下方图标即可转发',
            fontSize: 28 * PIXI.ratio,
            y: 365 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        icon = p_img(PIXI, {
            width: 54 * PIXI.ratio,
            height: 54 * PIXI.ratio,
            y: 500 * PIXI.ratio,
            src: 'images/share.png',
            relative_middle: { containerWidth: obj.width }
        }),
        logo = p_img(PIXI, {
            width: 36 * PIXI.ratio,
            height: 36 * PIXI.ratio,
            x: 294 * PIXI.ratio,
            y: obj.height - 66 * PIXI.ratio,
            src: 'images/logo.png'
        }),
        logoName = p_text(PIXI, {
            content: '小游戏示例',
            fontSize: 26 * PIXI.ratio,
            fill: 0x576b95,
            y: (obj.height - 62 * PIXI.ratio) | 0,
            relative_middle: { point: 404 * PIXI.ratio }
        });

    icon.onClickFn(() => {
        callBack({
            status: 'shareAppMessage'
        });
    });

    container.addChild(p_goBackBtn(PIXI, 'delPage'), title, api_name, underline, prompt, icon, logo, logoName);
    container.visible = false;
    app.stage.addChild(container);

    return container;
};
