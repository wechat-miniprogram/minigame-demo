import { p_text, p_button } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '游戏更新提醒',
            api_name: 'requestSubscribeWhatsNew',
            underline: false
        }),
        button = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: api_name.height + api_name.y + 28 * PIXI.ratio
        }),
        other_api_name = p_text(PIXI, {
            content: 'getWhatsNewSubscriptionsSetting',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            y: button.height + button.y + 38 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        other_button = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: other_api_name.height + other_api_name.y + 28 * PIXI.ratio
        });

    // 游戏更新订阅 “按钮” 开始
    button.myAddChildFn(
        p_text(PIXI, {
            content: `游戏更新订阅`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.onClickFn(() => {
        callBack({
            status: 'requestSubscribeWhatsNew'
        });
    });
    // 游戏更新订阅 “按钮” 结束

    // 游戏更新订阅状态查询 “按钮” 开始
    other_button.myAddChildFn(
        p_text(PIXI, {
            content: `游戏更新订阅状态查询`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: other_button.width, containerHeight: other_button.height }
        })
    );
    other_button.onClickFn(() => {
        callBack({
            status: 'getWhatsNewSubscriptionsSetting'
        });
    });
    // 游戏更新订阅状态查询 “按钮” 结束

    // !wx.requestSubscribeWhatsNew && wx.requestSubscribeWhatsNew();

    container.addChild(goBack, title, api_name, button, other_api_name, other_button, logo, logoName);

    app.stage.addChild(container);

    return container;
};
