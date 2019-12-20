import { p_button, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '显示操作菜单',
            api_name: 'showActionSheet'
        });

    //弹出action sheet “按钮” 开始
    let button = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        height: 80 * PIXI.ratio,
        color: 0xeeeeee,
        y: underline.y + underline.height + 150 * PIXI.ratio
    });
    button.addChild(
        p_text(PIXI, {
            content: '弹出action sheet',
            fontSize: 30 * PIXI.ratio,
            fill: 0x1aad19,
            fontWeight: 'bold',
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.onClickFn(() => {
        callBack({
            status: 'showActionSheet'
        });
    });
    //弹出action sheet “按钮” 结束

    container.addChild(goBack, title, api_name, underline, button, logo, logoName);
    app.stage.addChild(container);

    return container;
};
