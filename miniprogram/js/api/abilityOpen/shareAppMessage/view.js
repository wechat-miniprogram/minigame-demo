import { p_text, p_img } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '主动转发',
            api_name: 'shareAppMessage'
        }),
        prompt = p_text(PIXI, {
            content: '轻触下方图标即可转发',
            fontSize: 28 * PIXI.ratio,
            y: 365 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        icon = p_img(PIXI, {
            width: 54 * PIXI.ratio,
            height: 54 * PIXI.ratio,
            y: 500 * PIXI.ratio,
            src: 'images/share.png',
            relative_middle: { containerWidth: obj.width }
        });

    icon.onClickFn(() => {
        callBack({
            status: 'shareAppMessage'
        });
    });

    container.addChild(goBack, title, api_name, underline, prompt, icon, logo, logoName);

    app.stage.addChild(container);

    return container;
};
