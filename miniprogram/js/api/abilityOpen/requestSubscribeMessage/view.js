import { p_text, p_button } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '订阅消息',
            api_name: 'requestSubscribeMessage'
        }),
        button = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
        }),
        tipText = p_text(PIXI, {
            content: '提示：用户订阅成功后，将会在「服务通知」中\n接收到相关消息。开发者可自定义设置推送消\n息的条件及时间，在该示例中为即时下发。',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: button.height + button.y + 50 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        });

    // 点击订阅 “按钮” 开始
    button.myAddChildFn(
        p_text(PIXI, {
            content: `点击订阅`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.onClickFn(() => {
        callBack({
            status: 'requestSubscribeMessage'
        });
    });
    // 点击订阅 “按钮” 结束

    !wx.requestSubscribeMessage && wx.requestSubscribeMessage();

    container.addChild(goBack, title, api_name, underline, button, tipText, logo, logoName);

    app.stage.addChild(container);

    return container;
};
