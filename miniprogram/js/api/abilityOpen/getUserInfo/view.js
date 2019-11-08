import { p_button, p_text, p_line, p_img, p_box, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        title = p_text(PIXI, {
            content: '获取用户信息',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'getUserInfo',
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
            y: underline.y + underline.height + 24.4 * PIXI.ratio
        }),
        prompt = p_text(PIXI, {
            content: '未获取\n点击绿色按钮可获取用户头像及昵称',
            fontSize: 27 * PIXI.ratio,
            fill: 0x999999,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: 200 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        wipeData = p_button(PIXI, {
            width: 300 * PIXI.ratio,
            alpha: 0,
            height: 80 * PIXI.ratio,
            y: 930 * PIXI.ratio,
            radius: 5 * PIXI.ratio
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
        }),
        image,
        nickName;

    div.addChild(
        p_text(PIXI, {
            content: '用户信息',
            fontSize: 30 * PIXI.ratio,
            y: 50 * PIXI.ratio,
            relative_middle: { containerWidth: div.width }
        }),
        prompt
    );

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
        if (image) {
            image.hideFn();
            nickName.hideFn();
        }
        prompt.showFn();
    });
    // 清空“按钮”结束

    let goBack = p_goBackBtn(PIXI, 'delPage', () => {
        callBack({
            status: 'destroyUserInfoButton'
        });
    });

    container.addChild(goBack, title, api_name, underline, div, wipeData, logo, logoName);
    app.stage.addChild(container);

    callBack({
        status: 'createUserInfoButton',
        left: wipeData.x / obj.pixelRatio,
        top: (830 * PIXI.ratio) / obj.pixelRatio,
        width: wipeData.width / obj.pixelRatio,
        drawFn(res) {
            prompt.hideFn();
            if (!image) {
                image = p_img(PIXI, {
                    src: res.avatarUrl,
                    width: 132 * PIXI.ratio,
                    height: 132 * PIXI.ratio,
                    mask: 'circle',
                    y: 150 * PIXI.ratio,
                    relative_middle: { containerWidth: obj.width }
                });

                nickName = p_text(PIXI, {
                    content: res.nickName,
                    fontSize: 40 * PIXI.ratio,
                    fontWeight: "bold",
                    y: image.y + image.height + 30 * PIXI.ratio,
                    relative_middle: { containerWidth: div.width }
                });
                div.addChild(image, nickName);
            } else {
                image.turnImg({ src: res.avatarUrl });
                nickName.turnText(res.nickName);
                image.showFn();
                nickName.showFn();
            }
        }
    });

    return container;
};
