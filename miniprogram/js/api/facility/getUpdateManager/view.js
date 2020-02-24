import { p_button, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '更新',
            api_name: 'getUpdateManager'
        }),
        updateButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
        }),
        tipText = p_text(PIXI, {
            content: '提示：此API不需由开发者主动触发，而这里\n为了演示而使用',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: updateButton.height + updateButton.y + 120 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        });

    // 点击更新 “按钮” 开始
    updateButton.myAddChildFn(
        p_text(PIXI, {
            content: `点击更新`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: updateButton.width, containerHeight: updateButton.height }
        })
    );
    updateButton.onClickFn(() => {
        callBack({
            status: 'getUpdateManager',
        });
    });
    // 点击更新 “按钮” 结束

    !wx.getUpdateManager && wx.getUpdateManager();

    goBack.callBack = callBack.bind(null, { status: 'destroy' });

    container.addChild(goBack, title, api_name, underline, updateButton, tipText, logo, logoName);

    app.stage.addChild(container);

    return container;
};
