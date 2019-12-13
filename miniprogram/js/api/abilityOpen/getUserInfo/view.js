import { p_button, p_text, p_img, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '获取用户信息',
            api_name: 'getUserInfo'
        }),
        div = p_box(PIXI, {
            height: obj.width / 1.7,
            y: underline.y + underline.height + 24.4 * PIXI.ratio
        }),
        prompt = p_text(PIXI, {
            content: '未获取\n点击绿色按钮可获取用户头像及昵称',
            fontSize: 27 * PIXI.ratio,
            fill: 0x999999,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: 200 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        wipeData = p_button(PIXI, {
            width: 300 * PIXI.ratio,
            alpha: 0,
            height: 80 * PIXI.ratio,
            y: 930 * PIXI.ratio,
            radius: 5 * PIXI.ratio
        }),
        image,
        nickName;

    div.addChild(
        p_text(PIXI, {
            content: '用户信息',
            fontSize: 30 * PIXI.ratio,
            y: 50 * PIXI.ratio,
            relative_middle: { containerWidth: div.width }
        }),
        prompt
    );

    // 清空“按钮”开始
    wipeData.myAddChildFn(
        p_text(PIXI, {
            content: '清空',
            fontSize: 30 * PIXI.ratio,
            fontWeight: 'bold',
            relative_middle: { containerWidth: wipeData.width, containerHeight: wipeData.height }
        })
    );
    wipeData.onClickFn(() => {
        if (prompt.visible) return;
        if (image) {
            image.hideFn();
            nickName.hideFn();
        }
        prompt.showFn();
    });
    // 清空“按钮”结束

    goBack.callBack = callBack.bind(null, { status: 'destroyUserInfoButton' });

    container.addChild(goBack, title, api_name, underline, div, wipeData, logo, logoName);
    app.stage.addChild(container);

    callBack({
        status: 'createUserInfoButton',
        left: wipeData.x / obj.pixelRatio,
        top: (830 * PIXI.ratio) / obj.pixelRatio,
        width: wipeData.width / obj.pixelRatio,
        drawFn(res) {
            prompt.hideFn();
            if (!image) {
                image = p_img(PIXI, {
                    src: res.avatarUrl,
                    width: 132 * PIXI.ratio,
                    height: 132 * PIXI.ratio,
                    mask: 'circle',
                    y: 150 * PIXI.ratio,
                    relative_middle: { containerWidth: obj.width }
                });

                nickName = p_text(PIXI, {
                    content: res.nickName,
                    fontSize: 40 * PIXI.ratio,
                    fontWeight: 'bold',
                    y: image.y + image.height + 30 * PIXI.ratio,
                    relative_middle: { containerWidth: div.width }
                });
                div.addChild(image, nickName);
            } else {
                image.turnImg({ src: res.avatarUrl });
                nickName.turnText(res.nickName);
                image.showFn();
                nickName.showFn();
            }
        }
    });

    return container;
};
