import { p_button, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '小游戏推荐弹窗',
            api_name: 'createGamePortal'
        }),
        showButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
        }),
        tipText = p_text(PIXI, {
            content: '提示：当前小游戏推荐弹窗组件已经初始化',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: showButton.height + showButton.y + 40 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        });

    // 点击展示 “按钮” 开始
    showButton.myAddChildFn(
        p_text(PIXI, {
            content: `点击展示`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: showButton.width, containerHeight: showButton.height }
        })
    );
    showButton.onClickFn(() => {
        showButton.isTouchable(false);
        callBack({ status: 'show', drawFn: showButton.isTouchable.bind(null, true) });
    });
    // 点击展示 “按钮” 结束

    // 初始化 小游戏推荐弹窗组件 开始
    callBack({ status: 'createGamePortal' });
    // 初始化 小游戏推荐弹窗组件 结束

    !wx.createGamePortal && wx.createGamePortal();

    goBack.callBack = callBack.bind(null, { status: 'destroy' });

    container.addChild(goBack, title, api_name, underline, showButton, tipText, logo, logoName);

    app.stage.addChild(container);

    return container;
};
