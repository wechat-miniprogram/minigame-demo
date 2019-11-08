import { p_text, p_line, p_box, p_img, p_button, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        title = p_text(PIXI, {
            content: 'WebSocket',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'Web Socket',
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

    let socketState = p_box(PIXI, {
        height: 90 * PIXI.ratio
    });

    //绘制 on/off 开关按钮 start
    let off = p_img(PIXI, {
        width: 142 * PIXI.ratio,
        height: 90 * PIXI.ratio,
        src: 'images/off.png',
        x: socketState.width - 152 * PIXI.ratio,
        relative_middle: { containerHeight: socketState.height }
    });
    let on = p_img(PIXI, {
        width: 122 * PIXI.ratio,
        height: 87 * PIXI.ratio,
        src: 'images/on.png',
        x: socketState.width - 142 * PIXI.ratio
    });
    on.hideFn();
    off.onClickFn(() => {
        callBack('connection', () => {
            off.hideFn();
            on.showFn();
            button.isTouchable(true);
            button.turnColors({ color: 0x05c25f, alpha: 1 });
            sendText.turnColors(0xffffff);
        });
    });
    on.onClickFn(() => {
        callBack('disconnect', () => {
            off.showFn();
            on.hideFn();
            button.isTouchable(false);
            button.turnColors();
            sendText.turnColors();
        });
    });
    //绘制 on/off 开关按钮 end

    socketState.addChild(
        p_text(PIXI, {
            content: 'Socket状态',
            fontSize: 30 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: socketState.height }
        }),
        off,
        on
    );

    let news = p_box(PIXI, {
        height: socketState.height,
        y: socketState.y + socketState.height
    });
    news.addChild(
        p_text(PIXI, {
            content: '消息',
            fontSize: 30 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: news.height }
        }),
        p_text(PIXI, {
            content: 'Hello,小游戏!',
            fontSize: 30 * PIXI.ratio,
            fill: 0x999999,
            x: news.width - 210 * PIXI.ratio,
            relative_middle: { containerHeight: news.height }
        })
    );

    let box = p_box(PIXI, {
        height: news.y + news.height,
        border: {
            width: PIXI.ratio,
            color: 0x999999
        },
        y: underline.y + underline.height + 80 * PIXI.ratio
    });

    box.addChild(
        socketState,
        p_line(
            PIXI,
            {
                width: PIXI.ratio | 0,
                color: 0x999999
            },
            [30 * PIXI.ratio, socketState.height],
            [socketState.width - 30 * PIXI.ratio, 0]
        ),
        news
    );

    let button = p_button(PIXI, {
            y: box.y + box.height + 110 * PIXI.ratio,
            width: obj.width / 2,
            height: 80 * PIXI.ratio,
            alpha: 0
        }),
        sendText = p_text(PIXI, {
            content: '点我发送',
            fontSize: 30 * PIXI.ratio,
            fill: 0x999999,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        });
    button.myAddChildFn(sendText);
    button.onClickFn(() => {
        callBack('sendMessage');
    });
    button.isTouchable(false);

    const goBack = p_goBackBtn(PIXI, 'delPage', () => {
        callBack('disconnect');
    });

    container.addChild(goBack, title, api_name, underline, box, button, logo, logoName);
    app.stage.addChild(container);

    return container;
};
