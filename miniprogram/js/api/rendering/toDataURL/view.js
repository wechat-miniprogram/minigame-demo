import { p_text, p_img, p_button } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '转换为URL',
            api_name: 'toDataURL'
        }),
        button = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
        }),
        tipText = p_text(PIXI, {
            content: '提示：一旦使用了开放数据域，只能在离屏画布\n调用toDataURL才会返回base64',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: button.height + button.y + 50 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        });

    // 转换为URL “按钮” 开始
    button.myAddChildFn(
        p_text(PIXI, {
            content: `转换为URL`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.onClickFn(() => {
        callBack({
            status: 'toDataURL',
            drawFn(base64) {
                let img = p_img(PIXI, {
                    width: 620 * PIXI.ratio,
                    height: 224 * PIXI.ratio,
                    src: base64,
                    y: underline.height + underline.y + 67.5 * PIXI.ratio,
                    relative_middle: { containerWidth: obj.width }
                });
                img.name = 'img';

                button.hideFn();
                tipText.setPositionFn({ y: img.y + img.height + 50 * PIXI.ratio });
                
                container.addChild(img);
            }
        });
    });
    // 转换为URL “按钮” 结束

    goBack.callBack = () => {
        let img = container.getChildByName('img');
        img && container.removeChild(img).destroy(true);
    };

    window.router.getNowPage(page => {
        page.reload = function() {
            button.showFn();
            tipText.setPositionFn({ y: button.height + button.y + 50 * PIXI.ratio });
            logo.turnImg({ src: 'images/logo.png' });
        };
    });

    container.addChild(goBack, title, api_name, underline, button, tipText, logo, logoName);

    app.stage.addChild(container);

    return container;
};
