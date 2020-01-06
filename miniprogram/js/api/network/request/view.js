import { p_button, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '发送请求',
            api_name: 'request'
        }),
        explain = p_text(PIXI, {
            content: '点击向服务器发起请求',
            fontSize: 30 * PIXI.ratio,
            fill: 0x999999,
            y: underline.y + underline.height + 300 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        button = p_button(PIXI, {
            y: explain.y + explain.height + 300 * PIXI.ratio
        });

    button.myAddChildFn(
        p_text(PIXI, {
            content: 'request',
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );

    button.onClickFn(() => {
        callBack((res, time) => {
            explain.turnText(`数据包大小(字符长度)：${res.data.length || 0}\n请求耗时：${Date.now() - time}ms`);
        });
    });

    container.addChild(goBack, title, api_name, underline, explain, button, logo, logoName);
    app.stage.addChild(container);

    return container;
};
