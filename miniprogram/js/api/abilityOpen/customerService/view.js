import { p_text, p_line, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'navigateBack'),
        title = p_text(PIXI, {
            content: '客服服务',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'customerService',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            y: title.height + title.y + 78 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        underline = p_line(
            PIXI,
            {
                width: PIXI.ratio | 0,
                color: 0xd8d8d8
            },
            [(obj.width - 150 * PIXI.ratio) / 2, api_name.y + api_name.height + 23 * PIXI.ratio],
            [150 * PIXI.ratio, 0]
        ),
        prompt = p_text(PIXI, {
            content: '点击气泡icon打开客服消息界面',
            fontSize: 28 * PIXI.ratio,
            y: 350 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        icon = p_img(PIXI, {
            width: 75 * PIXI.ratio,
            height: 61 * PIXI.ratio,
            y: 500 * PIXI.ratio,
            src: 'images/contact.png',
            relative_middle: { containerWidth: obj.width }
        }),
        logo = p_img(PIXI, {
            width: 36 * PIXI.ratio,
            height: 36 * PIXI.ratio,
            x: 294 * PIXI.ratio,
            y: obj.height - 66 * PIXI.ratio,
            src: 'images/logo.png'
        }),
        logoName = p_text(PIXI, {
            content: '小游戏示例',
            fontSize: 26 * PIXI.ratio,
            fill: 0x576b95,
            y: (obj.height - 62 * PIXI.ratio) | 0,
            relative_middle: { point: 404 * PIXI.ratio }
        });

    icon.onClickFn(() => {
        callBack({
            status: 'openCustomerServiceConversation'
        });
    });

    setTimeout(() => {
        window.router.getNowPage(page => {
            page.reload = function() {
                logo.turnImg({ src: 'images/logo.png' });
            };
        });
    }, 0);

    container.addChild(goBack, title, api_name, underline, prompt, icon, logo, logoName);
    app.stage.addChild(container);

    return container;
};
