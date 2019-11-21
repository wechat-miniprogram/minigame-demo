import { p_button, p_text, p_line, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage', () => {
            callBack({
                status: 'close',
            });
        }),
        title = p_text(PIXI, {
            content: '开放数据域',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),

        api_name = p_text(PIXI, {
            content: '排行榜',
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
        appletCode = null,
        report = p_button(PIXI, {
            width: 300 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
        }),
        button = p_button(PIXI, {
            width: 300 * PIXI.ratio,
            y: report.height + report.y + 123 * PIXI.ratio
        }),
        gButton = p_button(PIXI, {
            width: 300 * PIXI.ratio,
            y: button.height + button.y + 123 * PIXI.ratio
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

    report.myAddChildFn(
        p_text(PIXI, {
            content: `上报随机分数`,
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.myAddChildFn(
        p_text(PIXI, {
            content: `查看好友排行`,
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    gButton.myAddChildFn(
        p_text(PIXI, {
            content: `查看群排行`,
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: gButton.width, containerHeight: gButton.height }
        })
    );

    let close = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        y: (obj.height - 200 * PIXI.ratio) | 0,
    });

    close.myAddChildFn(
        p_text(PIXI, {
            content: `关闭排行`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );

    close.onClickFn(() => {
        container.removeChild(close);
        callBack({
            status: 'close',
        });
    });

    button.onClickFn(() => {
        container.addChild(close);
        callBack({
            status: 'showFriendRank',
        });
    });

    gButton.onClickFn(() => {
        callBack({
            status: 'shareAppMessage',
        });
    });

    report.onClickFn(() => {
        callBack({
            status: 'setUserRecord',
        });
    });

    container.addChild(goBack, title, api_name, underline, report, button, gButton, logo, logoName);

    app.stage.addChild(container);

    return { container, close };
};
