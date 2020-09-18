import { p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function (PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: 'PC接力',
            api_name: 'startHandoff',
        }),
        tipText = p_text(PIXI, {
            content: '提示：相关API只能在开放数据域里调用，右\n上角...同样提供“在电脑上打开”接力按钮。为\n确保能体验完整功能，需先登陆windows\n电脑端微信（3.1.0及以上版本）',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: underline.height + underline.y + 173 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width },
        });

    goBack.callBack = callBack.bind(null, { status: 'close' });

    callBack({ status: 'PCHandoff' });

    container.addChild(goBack, title, api_name, underline, tipText, logo, logoName);

    app.stage.addChild(container);

    return container;
};
