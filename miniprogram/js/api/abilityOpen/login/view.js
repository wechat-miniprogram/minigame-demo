import { p_button, p_text, p_line, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'navigateBack'),
        title = p_text(PIXI, {
            content: '微信登录',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'Login',
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
            content: '每个微信号中仅需登录一次',
            fontSize: 26 * PIXI.ratio,
            fill: 0x9f9f9f,
            y: 500 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        has_logged_on = p_text(PIXI, {
            content: '已登录',
            fontSize: 50 * PIXI.ratio,
            fontWeight: 'bold',
            y: 550 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        another_tip = p_text(PIXI, {
            content: '每个微信号中仅需登录1次，后续每次进入页面即可\n根据微信id自动拉取用户信息',
            fontSize: 26 * PIXI.ratio,
            fill: 0x9f9f9f,
            align: 'center',
            y: 750 * PIXI.ratio,
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

    //微信登录“按钮” 开始
    let wxLogin = p_button(PIXI, {
        width: prompt.width,
        height: 80 * PIXI.ratio,
        y: 600 * PIXI.ratio
    });
    wxLogin.myAddChildFn(
        p_text(PIXI, {
            content: '微信登录',
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: wxLogin.width, containerHeight: wxLogin.height }
        })
    );
    wxLogin.onClickFn(() => {
        callBack({
            status: 'login',
            drawFn() {
                wxLogin.visible = false;
                prompt.visible = false;
                container.addChild(has_logged_on, another_tip);
            }
        });
    });
    //微信登录“按钮” 结束

    window.router.getNowPage(page => {
        page.reload = function() {
            logo.turnImg({ src: 'images/logo.png' });
        };
    });

    container.addChild(goBack, title, api_name, underline, prompt, wxLogin, logo, logoName);

    app.stage.addChild(container);

    return container;
};
