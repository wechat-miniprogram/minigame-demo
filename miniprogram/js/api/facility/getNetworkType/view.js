import { p_button, p_text, p_line, p_box, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: '获取手机网络状态',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'getNetworkType',
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
        prompt = p_text(PIXI, {
            content: '未获取\n点击绿色按钮可获取网络状态',
            fontSize: 27 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: 200 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
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
        prompt,
        network_state_text
    );

    let getNetworkTypeBtn = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        height: 80 * PIXI.ratio,
        y: 830 * PIXI.ratio,
        radius: 5 * PIXI.ratio
    });
    getNetworkTypeBtn.myAddChildFn(
        p_text(PIXI, {
            content: '获取手机网络状态',
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: getNetworkTypeBtn.width, containerHeight: getNetworkTypeBtn.height }
        })
    );
    getNetworkTypeBtn.onClickFn(() => {
        callBack({
            status: 'getNetworkType',
            drawFn(res) {
                prompt.visible = false;
                network_state_text.visible = true;
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
    });

    //清空“按钮”开始
    let wipeData = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        alpha: 0,
        height: 80 * PIXI.ratio,
        y: 930 * PIXI.ratio,
        radius: 5 * PIXI.ratio
    });
    wipeData.myAddChildFn(
        p_text(PIXI, {
            content: '清空',
            fontSize: 30 * PIXI.ratio,
            relative_middle: { containerWidth: wipeData.width, containerHeight: wipeData.height }
        })
    );
    wipeData.onClickFn(() => {
        if (prompt.visible) return;
        prompt.visible = true;
        network_state_text.visible = false;
    });
    //清空“按钮”结束

    container.addChild(goBack, title, api_name, underline, div, getNetworkTypeBtn, wipeData, logo, logoName);
    app.stage.addChild(container);

    return container;
};
