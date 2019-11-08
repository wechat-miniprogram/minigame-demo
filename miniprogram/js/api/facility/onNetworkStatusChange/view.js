import { p_text, p_line, p_box, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: '监听手机网络变化',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'onNetworkStatusChange',
            fontSize: 30 * PIXI.ratio,
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
        div = p_box(PIXI, {
            height: 400 * PIXI.ratio,
            y: underline.y + underline.height + 80 * PIXI.ratio
        }),
        network_state_text = p_text(PIXI, {
            content: '',
            fontSize: 60 * PIXI.ratio,
            align: 'center',
            y: 220 * PIXI.ratio,
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

    div.addChild(
        p_text(PIXI, {
            content: '网络状态',
            fontSize: 30 * PIXI.ratio,
            y: 50 * PIXI.ratio,
            relative_middle: { containerWidth: div.width }
        }),
        network_state_text
    );

    callBack({
        status: 'onNetworkStatusChange',
        drawFn(res) {
            network_state_text.turnText(
                {
                    wifi: 'wifi',
                    '2g': '2g',
                    '3g': '3g',
                    '4g': '4g',
                    unknown: '不常见的未知网络',
                    none: '无网络'
                }[res.networkType]
            );
        }
    });

    container.addChild(goBack, title, api_name, underline, div, logo, logoName);
    app.stage.addChild(container);

    return container;
};
