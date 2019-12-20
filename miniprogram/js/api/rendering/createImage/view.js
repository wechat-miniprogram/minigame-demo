import { p_text, p_img, p_button } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '创建一个图片对象',
            api_name: 'createImage'
        }),
        button = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
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
