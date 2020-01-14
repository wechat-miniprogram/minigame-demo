import { p_text, p_img } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '游戏圈',
            api_name: 'createGameClubButton'
        }),
        prompt = p_text(PIXI, {
            content: '点击图标打开游戏圈界面',
            fontSize: 28 * PIXI.ratio,
            y: 350 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        });

    callBack({ status: 'createGameClubButton', style: { x: ((375 - 40) * obj.width) / (375 * 2 * obj.pixelRatio), y: (450 * PIXI.ratio) / obj.pixelRatio } });

    goBack.callBack = callBack.bind(null, { status: 'destroy' });

    container.addChild(goBack, title, api_name, underline, prompt, logo, logoName);
    app.stage.addChild(container);

    return container;
};
