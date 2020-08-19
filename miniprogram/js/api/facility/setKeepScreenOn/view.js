import { p_text, p_box, p_img } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '屏幕常亮',
            api_name: 'setKeepScreenOn'
        }),
        div = p_box(PIXI, {
            height: 89 * PIXI.ratio,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: underline.y + underline.height + 75 * PIXI.ratio
        }),
        text = p_text(PIXI, {
            content: '仅在当前小程序生效\n离开小程序后设置失效',
            fontSize: 30 * PIXI.ratio,
            fill: 0x353535,
            align: 'center',
            lineHeight: 55 * PIXI.ratio,
            y: div.y + div.height + 71 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        });

    //switch button 开始
    let off = p_img(PIXI, {
        width: 142 * PIXI.ratio,
        height: 90 * PIXI.ratio,
        src: 'images/off.png',
        x: div.width - 152 * PIXI.ratio,
        relative_middle: { containerHeight: div.height }
    });
    let on = p_img(PIXI, {
        width: 122 * PIXI.ratio,
        height: 87 * PIXI.ratio,
        src: 'images/on.png',
        x: div.width - 142 * PIXI.ratio
    });
    on.hideFn();
    off.onClickFn(() => {
        callBack({
            status: 'setKeepScreenOn',
            keepScreenOn: true,
            drawFn() {
                off.hideFn();
                on.showFn();
            }
        });
    });
    on.onClickFn(() => {
        callBack({
            status: 'setKeepScreenOn',
            keepScreenOn: false,
            drawFn() {
                off.showFn();
                on.hideFn();
            }
        });
    });
    //switch button 结束

    div.addChild(
        p_text(PIXI, {
            content: '屏幕常亮',
            fontSize: 34 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: div.height }
        }),
        off,
        on
    );

    window.router.getNowPage(page => {
        page.reload = function() {
            logo.reloadImg({ src: 'images/logo.png' });
            off.turnImg({ src: 'images/off.png' });
            on.turnImg({ src: 'images/on.png' });
        };
    });

    container.addChild(goBack, title, api_name, underline, div, text, logo, logoName);
    container.visible = false;
    app.stage.addChild(container);

    return container;
};
