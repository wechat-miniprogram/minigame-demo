import { p_button, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '小游戏推荐icon',
            api_name: 'createGameIcon'
        }),
        gameIconButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
        }),
        tipText = p_text(PIXI, {
            content: '提示：小游戏推荐icon组件支持修改自身位置大\n小、个数等，可在组件初始化时进行设置',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: gameIconButton.height + gameIconButton.y + 120 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        hideButton = p_button(PIXI, {
            width: 576 * PIXI.ratio,
            height: 90 * PIXI.ratio,
            border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
            alpha: 0,
            y: underline.height + underline.y + 453 * PIXI.ratio
        }),
        showButton = p_button(PIXI, {
            width: 576 * PIXI.ratio,
            height: 90 * PIXI.ratio,
            border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
            alpha: 0,
            y: hideButton.y
        }),
        destroyButton = p_button(PIXI, {
            width: 576 * PIXI.ratio,
            height: 90 * PIXI.ratio,
            border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
            alpha: 0,
            y: hideButton.height + hideButton.y + 22 * PIXI.ratio
        });

    tipText.hideFn();

    // 点击展示 “按钮” 开始
    gameIconButton.myAddChildFn(
        p_text(PIXI, {
            content: `点击展示`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: gameIconButton.width, containerHeight: gameIconButton.height }
        })
    );
    gameIconButton.onClickFn(() => {
        gameIconButton.hideFn();
        callBack({
            status: 'createGameIcon',
            style: Array.apply(null, { length: 8 }).map((item, index) => {
                item = {
                    top: (underline.y + underline.height + (13 + ~~((index + 1) / 5) * 158) * PIXI.ratio) / obj.pixelRatio,
                    left: ((obj.width / 5) * ((index % 4) + 1) - 38 * obj.pixelRatio) / obj.pixelRatio
                };
                return item;
            }),
            drawFn(res) {
                if (res) return gameIconButton.showFn();
                tipText.showFn();
                hideButton.showFn();
                destroyButton.showFn();
            }
        });
    });
    // 点击展示 “按钮” 结束

    // 隐藏 小游戏推荐 icon “按钮” 开始
    hideButton.myAddChildFn(
        p_text(PIXI, {
            content: `隐藏小游戏推荐icon`,
            fontSize: 36 * PIXI.ratio,
            relative_middle: { containerWidth: hideButton.width, containerHeight: hideButton.height }
        })
    );
    hideButton.onClickFn(() => {
        callBack({
            status: 'hide',
            drawFn() {
                hideButton.hideFn();
                showButton.showFn();
            }
        });
    });
    hideButton.hideFn();
    // 隐藏 小游戏推荐 icon “按钮” 结束

    // 显示 小游戏推荐 icon “按钮” 开始
    showButton.myAddChildFn(
        p_text(PIXI, {
            content: `显示小游戏推荐icon`,
            fontSize: 36 * PIXI.ratio,
            relative_middle: { containerWidth: showButton.width, containerHeight: showButton.height }
        })
    );
    showButton.onClickFn(() => {
        callBack({
            status: 'show',
            drawFn() {
                showButton.hideFn();
                hideButton.showFn();
            }
        });
    });
    showButton.hideFn();
    // 显示 小游戏推荐 icon “按钮” 结束

    // 销毁 小游戏推荐 icon “按钮” 开始
    destroyButton.myAddChildFn(
        p_text(PIXI, {
            content: `销毁小游戏推荐icon`,
            fontSize: 36 * PIXI.ratio,
            relative_middle: { containerWidth: destroyButton.width, containerHeight: destroyButton.height }
        })
    );
    destroyButton.onClickFn(() => {
        callBack({
            status: 'destroy',
            drawFn() {
                destroyButton.hideFn();
                showButton.hideFn();
                hideButton.hideFn();
                tipText.hideFn();
                gameIconButton.showFn();
            }
        });
    });
    destroyButton.hideFn();
    // 销毁 小游戏推荐 icon “按钮” 结束

    !wx.createGameIcon && wx.createGameIcon();

    goBack.callBack = callBack.bind(null, { status: 'destroy' });

    container.addChild(goBack, title, api_name, underline, gameIconButton, tipText, hideButton, showButton, destroyButton, logo, logoName);

    app.stage.addChild(container);

    return container;
};
