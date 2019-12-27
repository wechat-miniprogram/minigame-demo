import { p_text, p_box, p_button } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '加载自定义字体文件',
            api_name: 'loadFont'
        }),
        box = p_box(PIXI, {
            height: 372 * PIXI.ratio,
            y: underline.y + underline.height + 23 * PIXI.ratio
        }),
        text = p_text(PIXI, {
            content: 'Hello WeChat',
            fontSize: 60 * PIXI.ratio,
            fill: 0x353535,
            relative_middle: { containerWidth: box.width, containerHeight: box.height }
        }),
        button = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: box.height + box.y + 80 * PIXI.ratio
        });

    // 加载自定义字体文件 “按钮” 开始
    button.myAddChildFn(
        p_text(PIXI, {
            content: `加载自定义字体文件`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.onClickFn(() => {
        callBack({
            status: 'loadFont',
            drawFn(font) {
                text.turnText('', { fontFamily: font || '' });
            }
        });
    });
    // 加载自定义字体文件 “按钮” 结束

    box.addChild(text);
    container.addChild(goBack, title, api_name, underline, box, button, logo, logoName);

    app.stage.addChild(container);

    return container;
};
