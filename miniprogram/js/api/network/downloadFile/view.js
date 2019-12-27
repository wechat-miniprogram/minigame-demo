import { p_button, p_text, p_img } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '下载文件',
            api_name: 'downloadFile'
        }),
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
