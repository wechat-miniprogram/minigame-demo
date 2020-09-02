import { p_text, p_img, p_button } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function (PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: 'PC接力',
            api_name: 'startHandoff',
        }),
        button = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio,
        }),
        tipText = p_text(PIXI, {
            content: '提示：右上角...同样提供“在电脑上打开”接力\n按钮。为确保能体验完整功能，需先登陆\nwindows电脑端微信（3.1.0及以上版本）',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: button.height + button.y + 50 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width },
        });

    // 在电脑上打开 “按钮” 开始
    button.myAddChildFn(
        p_text(PIXI, {
            content: `在电脑上打开`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height },
        })
    );
    button.onClickFn(() => {
        callBack({
            status: 'startHandoff',
        });
    });
    // 在电脑上打开 “按钮” 结束

    container.addChild(goBack, title, api_name, underline, button, tipText, logo, logoName);

    app.stage.addChild(container);

    return container;
};
