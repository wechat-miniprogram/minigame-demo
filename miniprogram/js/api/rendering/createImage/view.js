import { p_text, p_line, p_img, p_button, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: '创建一个图片对象',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'createImage',
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
        button = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
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

    // 创建 “按钮” 开始
    button.myAddChildFn(
        p_text(PIXI, {
            content: `创建`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.onClickFn(() => {
        callBack({
            status: 'createImage',
            drawFn(image) {
                button.hideFn();
                let img = p_img(PIXI, {
                    width: 620 * PIXI.ratio,
                    height: 224 * PIXI.ratio,
                    src: image.src,
                    y: underline.height + underline.y + 67.5 * PIXI.ratio,
                    relative_middle: { containerWidth: obj.width }
                });
                container.addChild(
                    img,
                    p_text(PIXI, {
                        content: `width:${image.width}px   height:${image.height}px`,
                        fontSize: 30 * PIXI.ratio,
                        fill: 0x353535,
                        y: img.height + img.y + 30 * PIXI.ratio,
                        relative_middle: { containerWidth: obj.width }
                    })
                );
            }
        });
    });
    // 创建 “按钮” 结束

    container.addChild(goBack, title, api_name, underline, button, logo, logoName);

    app.stage.addChild(container);

    return container;
};
