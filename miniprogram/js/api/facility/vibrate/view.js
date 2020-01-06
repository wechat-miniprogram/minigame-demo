import { p_text, p_button } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '震动',
            api_name: 'vibrate/Long/Short'
        }),
        longButton = p_button(PIXI, {
            width: 334 * PIXI.ratio,
            height: 80 * PIXI.ratio,
            color: 0x05c25f,
            y: underline.height + underline.y + 123 * PIXI.ratio
        }),
        shortButton = p_button(PIXI, {
            width: longButton.width,
            height: longButton.height,
            color: 0xf2f2f2,
            y: longButton.height + longButton.y + 20 * PIXI.ratio
        });

    // 长振动 “按钮” 开始
    longButton.myAddChildFn(
        p_text(PIXI, {
            content: `长振动`,
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            fontWeight: 'bold',
            relative_middle: { containerWidth: longButton.width, containerHeight: longButton.height }
        })
    );
    longButton.onClickFn(() => {
        callBack({
            status: 'vibrateLong'
        });
    });
    // 长振动 “按钮” 结束

    // 短振动 “按钮” 开始
    shortButton.myAddChildFn(
        p_text(PIXI, {
            content: `短振动`,
            fontSize: 30 * PIXI.ratio,
            fill: 0x05c25f,
            fontWeight: 'bold',
            relative_middle: { containerWidth: shortButton.width, containerHeight: shortButton.height }
        })
    );
    shortButton.onClickFn(() => {
        callBack({
            status: 'vibrateShort'
        });
    });
    // 短振动 “按钮” 结束

    container.addChild(goBack, title, api_name, underline, longButton, shortButton, logo, logoName);

    app.stage.addChild(container);

    return container;
};
