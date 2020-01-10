import { p_button, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '微信登录',
            api_name: 'Login'
        }),
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
        });

    // 微信登录“按钮” 开始
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
    // 微信登录“按钮” 结束

    window.router.getNowPage(page => {
        page.reload = function() {
            logo.turnImg({ src: 'images/logo.png' });
        };
    });

    container.addChild(goBack, title, api_name, underline, prompt, wxLogin, logo, logoName);

    app.stage.addChild(container);

    return container;
};
