import { p_button, p_text, p_line, p_img, p_box, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: '获取UnionID',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'cloudFunction:getUnionID',
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
        div = p_box(PIXI, {
            height: obj.width / 1.7,
            y: underline.y + underline.height + 74.4 * PIXI.ratio
        }),
        prompt = p_text(PIXI, {
            content:
                '点击绿色按钮可通过云开发获取用户 UnionID\n使用云开发，无需自己部署服务端并维护复杂的鉴权\n机制，在小程序端简单调用即可通过云端获取天然可\n用的UnionID',
            fontSize: 28 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: 180 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        UnionID_text = p_text(PIXI, {
            content: '',
            fontSize: 32 * PIXI.ratio,
            y: prompt.y + 30 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        button = p_button(PIXI, {
            width: 334 * PIXI.ratio,
            height: 80 * PIXI.ratio,
            color: 0x05c25f,
            y: 830 * PIXI.ratio
        }),
        wipeData = p_button(PIXI, {
            width: button.width,
            alpha: 0,
            height: button.height,
            y: 930 * PIXI.ratio
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
            content: 'UnionID',
            fontSize: 30 * PIXI.ratio,
            y: 50 * PIXI.ratio,
            relative_middle: { containerWidth: div.width }
        }),
        prompt,
        UnionID_text
    );

    // 获取 UnionID “按钮” 开始
    button.myAddChildFn(
        p_text(PIXI, {
            content: '获取 UnionID',
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            fontWeight: 'bold',
            relative_middle: { containerWidth: wipeData.width, containerHeight: wipeData.height }
        })
    );
    button.onClickFn(() => {
        callBack({
            status: 'UnionID',
            drawFn(res) {
                UnionID_text.turnText(res);
                prompt.hideFn();
            }
        });

        prompt.hideFn();
    });
    // 获取 UnionID “按钮” 结束

    // 清空“按钮”开始
    wipeData.myAddChildFn(
        p_text(PIXI, {
            content: '清空',
            fontSize: 30 * PIXI.ratio,
            fontWeight: 'bold',
            relative_middle: { containerWidth: wipeData.width, containerHeight: wipeData.height }
        })
    );
    wipeData.onClickFn(() => {
        if (prompt.visible) return;
        UnionID_text.turnText();
        prompt.showFn();
    });
    // 清空“按钮”结束

    container.addChild(goBack, title, api_name, underline, div, button, wipeData, logo, logoName);
    app.stage.addChild(container);

    return container;
};
