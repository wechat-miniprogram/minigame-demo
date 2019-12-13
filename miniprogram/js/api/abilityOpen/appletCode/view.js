import { p_button, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '生成二维码',
            api_name: 'cloudFunction:getAppletCode'
        }),
        appletCode = null,
        button = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
        });

    // 点击生成“按钮”开始
    button.myAddChildFn(
        p_text(PIXI, {
            content: `点击生成`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.onClickFn(() => {
        callBack(base64 => {
            appletCode = new PIXI.Sprite(PIXI.Texture.from(base64));
            appletCode.width = appletCode.height = 430 * PIXI.ratio;
            appletCode.position.set((obj.width - appletCode.width) / 2, underline.y + underline.height + 100 * PIXI.ratio);
            container.addChild(appletCode);
            button.hideFn();
        });
    });
    // 点击生成“按钮”结束

    container.addChild(goBack, title, api_name, underline, button, logo, logoName);

    app.stage.addChild(container);

    return container;
};
