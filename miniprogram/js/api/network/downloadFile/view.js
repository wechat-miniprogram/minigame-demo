import { p_button, p_text, p_line, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: '下载文件',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'downloadFile',
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
        explain = p_text(PIXI, {
            content: '点击按钮下载服务端实例图片',
            fontSize: 30 * PIXI.ratio,
            fill: 0x999999,
            y: underline.y + underline.height + 300 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        button = p_button(PIXI, {
            y: explain.y + explain.height + 300 * PIXI.ratio
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
        sprite = null;

    button.myAddChildFn(
        p_text(PIXI, {
            content: '下载',
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );

    button.onClickFn(() => {
        callBack(tempFilePath => {
            PIXI.loader.add(tempFilePath).load(() => {
                sprite = p_img(PIXI, {
                    src: tempFilePath,
                    is_PIXI_loader: true,
                    x: 30 * PIXI.ratio,
                    y: underline.y + underline.height + 200 * PIXI.ratio
                });
                sprite.height = ((obj.width - 60 * PIXI.ratio) * sprite.height) / sprite.width;
                sprite.width = obj.width - 60 * PIXI.ratio;
                explain.hideFn();
                button.hideFn();
                container.addChild(sprite);
            });
        });
    });

    container.addChild(goBack, title, api_name, underline, explain, button, logo, logoName);
    app.stage.addChild(container);

    return container;
};
