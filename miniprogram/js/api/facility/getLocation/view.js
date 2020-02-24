import { p_button, p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '获取当前位置',
            api_name: 'getLocation'
        }),
        div = p_box(PIXI, {
            height: 400 * PIXI.ratio,
            y: underline.y + underline.height + 80 * PIXI.ratio
        }),
        prompt = p_text(PIXI, {
            content: '未获取',
            fontSize: 27 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: 200 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        network_state_text = p_text(PIXI, {
            content: '',
            fontSize: 50 * PIXI.ratio,
            align: 'center',
            y: 205 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        });

    div.addChild(
        p_text(PIXI, {
            content: '当前位置经纬度',
            fontSize: 30 * PIXI.ratio,
            y: 50 * PIXI.ratio,
            relative_middle: { containerWidth: div.width }
        }),
        prompt,
        network_state_text
    );

    let getLocationBtn = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        height: 80 * PIXI.ratio,
        y: 830 * PIXI.ratio,
        radius: 5 * PIXI.ratio
    });
    getLocationBtn.myAddChildFn(
        p_text(PIXI, {
            content: '获取位置',
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: getLocationBtn.width, containerHeight: getLocationBtn.height }
        })
    );
    getLocationBtn.onClickFn(() => {
        callBack({
            status: 'getLocation',
            drawFn(res) {
                res.latitude = (res.latitude + '').split('.');
                res.longitude = (res.longitude + '').split('.');
                prompt.visible = false;
                network_state_text.turnText(`E: ${res.longitude[0]+'°'+res.longitude[0]+'′'}   N: ${res.latitude[0]+'°'+res.latitude[0]+'′'}`);
                network_state_text.visible = true;
            }
        });
    });

    //清空“按钮”开始
    let wipeData = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        alpha: 0,
        height: 80 * PIXI.ratio,
        y: 930 * PIXI.ratio,
        radius: 5 * PIXI.ratio
    });
    wipeData.myAddChildFn(
        p_text(PIXI, {
            content: '清空',
            fontSize: 30 * PIXI.ratio,
            relative_middle: { containerWidth: wipeData.width, containerHeight: wipeData.height }
        })
    );
    wipeData.onClickFn(() => {
        if (prompt.visible) return;
        prompt.visible = true;
        network_state_text.visible = false;
    });
    //清空“按钮”结束

    container.addChild(goBack, title, api_name, underline, div, getLocationBtn, wipeData, logo, logoName);
    app.stage.addChild(container);

    return container;
};
