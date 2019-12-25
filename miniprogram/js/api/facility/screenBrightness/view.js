import { p_text, p_box, p_circle } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '屏幕亮度',
            api_name: 'get/set/ScreenBrightness'
        }),
        div = p_box(PIXI, {
            height: 474.4 * PIXI.ratio,
            y: underline.y + underline.height + 80 * PIXI.ratio
        }),
        text = p_text(PIXI, {
            content: '',
            fontSize: 72 * PIXI.ratio,
            y: 225 * PIXI.ratio,
            relative_middle: { containerWidth: div.width }
        });

    div.addChild(
        p_text(PIXI, {
            content: '当前屏幕亮度',
            fontSize: 34 * PIXI.ratio,
            y: 54 * PIXI.ratio,
            relative_middle: { containerWidth: div.width }
        }),
        text,
        p_text(PIXI, {
            content: '设置屏幕亮度',
            fontSize: 28 * PIXI.ratio,
            fill: 0x9f9f9f,
            x: 46 * PIXI.ratio,
            y: div.height + 36.6 * PIXI.ratio
        })
    );

    // 滑动调节亮度UI 开始
    let grayLine = p_box(PIXI, {
            width: 580 * PIXI.ratio,
            height: 4 * PIXI.ratio,
            radius: 2 * PIXI.ratio,
            background: { color: 0xb5b6b5 },
            y: div.y + div.height + 49 * PIXI.ratio
        }),
        greenLine = p_box(PIXI, {
            width: grayLine.width,
            height: grayLine.height,
            radius: 2 * PIXI.ratio,
            background: { color: 0x09bb07 },
            y: grayLine.y
        }),
        circle = p_circle(PIXI, {
            radius: 20 * PIXI.ratio,
            background: { color: 0x09bb07 },
            x: greenLine.x,
            y: greenLine.y + greenLine.height / 2
        });
    greenLine.width = 0;
    circle.onTouchMoveFn(e => {
        if (e.data.global.x >= grayLine.x && grayLine.x + grayLine.width >= e.data.global.x) {
            circle.setPositionFn({ x: e.data.global.x });
            greenLine.width = e.data.global.x - greenLine.x;
            text.turnText(`${Math.round((greenLine.width / grayLine.width) * 10) / 10}`);
            callBack({
                status: 'setScreenBrightness',
                value: +text.text
            });
        }
    });
    // 滑动调节亮度UI 结束

    // 获取屏幕亮度函数调用 开始
    callBack({
        status: 'getScreenBrightness',
        drawFn(res) {
            text.turnText(`${Math.round(res.value * 10) / 10}`);
            circle.setPositionFn({ x: greenLine.x + (greenLine.width = grayLine.width * text.text) });
        }
    });
    // 获取屏幕亮度函数调用 结束

    container.addChild(
        p_box(PIXI, { height: obj.height, background: { alpha: 0 } }),
        goBack,
        title,
        api_name,
        underline,
        div,
        grayLine,
        greenLine,
        circle,
        logo,
        logoName
    );
    container.interactive = true;
    container.touchend = () => {
        circle.touchmove = null;
    };
    app.stage.addChild(container);

    return container;
};
