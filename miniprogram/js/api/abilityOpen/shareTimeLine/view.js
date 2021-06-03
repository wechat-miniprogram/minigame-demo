import { p_text, p_img } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    !wx.shareTimeLine && wx.shareTimeLine();

    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '转发到朋友圈',
            api_name: 'shareTimeLine'
        }),
        prompt = p_text(PIXI, {
            content: '轻触下方图标即可转发',
            fontSize: 28 * PIXI.ratio,
            y: 365 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        icon = p_img(PIXI, {
            width: 110 * PIXI.ratio,
            height: 110 * PIXI.ratio,
            y: 500 * PIXI.ratio,
            src: 'images/circleFriends.png',
            relative_middle: { containerWidth: obj.width }
        });

    icon.onClickFn(() => {
        callBack({
            status: 'shareTimeLine'
        });
    });

    container.addChild(goBack, title, api_name, underline, prompt, icon, logo, logoName);

    app.stage.addChild(container);

    return container;
};
