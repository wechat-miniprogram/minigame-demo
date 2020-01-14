import { p_text, p_img } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '客服服务',
            api_name: 'customerService'
        }),
        prompt = p_text(PIXI, {
            content: '点击气泡icon打开客服消息界面',
            fontSize: 28 * PIXI.ratio,
            y: 350 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        icon = p_img(PIXI, {
            width: 75 * PIXI.ratio,
            height: 61 * PIXI.ratio,
            y: 500 * PIXI.ratio,
            src: 'images/contact.png',
            relative_middle: { containerWidth: obj.width }
        });

    icon.onClickFn(() => {
        callBack({
            status: 'openCustomerServiceConversation'
        });
    });

    container.addChild(goBack, title, api_name, underline, prompt, icon, logo, logoName);
    app.stage.addChild(container);

    return container;
};
