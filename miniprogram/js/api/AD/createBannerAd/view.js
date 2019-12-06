import { p_button, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: 'banner 广告',
            api_name: 'createBannerAd'
        }),
        bannerAdButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
        }),
        hideButton = p_button(PIXI, {
            width: 576 * PIXI.ratio,
            height: 90 * PIXI.ratio,
            border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
            alpha: 0,
            y: underline.height + underline.y + 343 * PIXI.ratio
        }),
        showButton = p_button(PIXI, {
            width: 576 * PIXI.ratio,
            height: 90 * PIXI.ratio,
            border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
            alpha: 0,
            y: underline.height + underline.y + 343 * PIXI.ratio
        }),
        destroyButton = p_button(PIXI, {
            width: 576 * PIXI.ratio,
            height: 90 * PIXI.ratio,
            border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
            alpha: 0,
            y: hideButton.height + hideButton.y + 22 * PIXI.ratio
        });

    // 打开 banner 广告 “按钮” 开始
    bannerAdButton.myAddChildFn(
        p_text(PIXI, {
            content: `打开 banner 广告`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: bannerAdButton.width, containerHeight: bannerAdButton.height }
        })
    );
    bannerAdButton.onClickFn(() => {
        bannerAdButton.hideFn();
        callBack({
            status: 'createBannerAd',
            style: {
                top: (underline.y + underline.height + 53 * PIXI.ratio) / obj.pixelRatio,
                left: (15 * obj.width) / (375 * obj.pixelRatio),
                width: (345 * obj.width) / (375 * obj.pixelRatio)
            },
            drawFn(res) {
                if (res) return bannerAdButton.showFn();
                hideButton.showFn();
                destroyButton.showFn();
            }
        });
    });
    // 打开 banner 广告 “按钮” 结束

    // 隐藏 banner 广告 “按钮” 开始
    hideButton.myAddChildFn(
        p_text(PIXI, {
            content: `隐藏 banner 广告`,
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
    // 隐藏 banner 广告 “按钮” 结束

    // 显示 banner 广告 “按钮” 开始
    showButton.myAddChildFn(
        p_text(PIXI, {
            content: `显示 banner 广告`,
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
    // 显示 banner 广告 “按钮” 结束

    // 销毁 banner 广告 “按钮” 开始
    destroyButton.myAddChildFn(
        p_text(PIXI, {
            content: `销毁 banner 广告`,
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
                bannerAdButton.showFn();
            }
        });
    });
    destroyButton.hideFn();
    // 销毁 banner 广告 “按钮” 结束

    goBack.callBack = callBack.bind(null, { status: 'destroy' });

    container.addChild(
        goBack,
        title,
        api_name,
        underline,
        bannerAdButton,
        hideButton,
        showButton,
        destroyButton,
        logo,
        logoName
    );

    app.stage.addChild(container);

    return container;
};
