import { p_button, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function (PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '发送小程序消息',
            api_name: 'cloudFunction:programMessage',
        }),
        separateSendButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 103 * PIXI.ratio,
        }),
        // groupSendButton = p_button(PIXI, {
        //     width: 580 * PIXI.ratio,
        //     y: separateSendButton.height + separateSendButton.y + 30 * PIXI.ratio,
        // }),
        tipText = p_text(PIXI, {
            content: '提示：已添加此小游戏到“我的小程序”且大于\n48小时的用户才能收到消息，另外用户一周\n只能接收某个小程序一条消息',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: separateSendButton.height + separateSendButton.y + 30 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width },
        });

    // 单发给个人“按钮”开始
    separateSendButton.myAddChildFn(
        p_text(PIXI, {
            content: `单用户下发`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: separateSendButton.width, containerHeight: separateSendButton.height },
        })
    );
    separateSendButton.onClickFn(() => {
        callBack({ status: 'send', msg_type: 'ONE' });
    });
    // 单发给个人“按钮”结束

    // 群发“按钮”开始
    // groupSendButton.myAddChildFn(
    //     p_text(PIXI, {
    //         content: `群发`,
    //         fontSize: 36 * PIXI.ratio,
    //         fill: 0xffffff,
    //         relative_middle: { containerWidth: groupSendButton.width, containerHeight: groupSendButton.height },
    //     })
    // );
    // groupSendButton.onClickFn(() => {
    //     callBack({ status: 'send', msg_type: 'ALL' });
    // });
    // 群发“按钮”结束

    container.addChild(goBack, title, api_name, underline, separateSendButton, tipText, logo, logoName);

    app.stage.addChild(container);

    return container;
};
