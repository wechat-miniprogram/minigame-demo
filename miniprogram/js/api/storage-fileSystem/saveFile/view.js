import { p_button, p_text, p_box, p_img } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '保存临时文件到本地',
            api_name: 'saveFile'
        }),
        tipText = p_text(PIXI, {
            content: '提示：这里会保存一个mp4文件，文件来源看源码',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        pitch_on,
        div;

    let pathArr = [`${wx.env.USER_DATA_PATH}/fileA/video.mp4`, '选择保存为本地缓存路径'],
        divDeploy = {
            height: 0,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: underline.height + underline.y + 98 * PIXI.ratio
        },
        div_child_arr = [];

    for (let i = 0, len = pathArr.length; i < len; i++) {
        div_child_arr[i] = p_box(PIXI, {
            height: 88 * PIXI.ratio,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: i ? div_child_arr[i - 1].height + div_child_arr[i - 1].y - (PIXI.ratio | 0) : 0
        });

        div_child_arr[i].addChild(
            p_text(PIXI, {
                content: pathArr[i],
                fontSize: 34 * PIXI.ratio,
                x: 30 * PIXI.ratio,
                relative_middle: { containerHeight: div_child_arr[i].height }
            })
        );
        div_child_arr[i].onClickFn(e => {
            if (e.target === pitch_on.parent) return;

            pitch_on.parent.removeChild(pitch_on);
            pitch_on.setPositionFn({ relative_middle: { containerHeight: e.target.height } });
            e.target.addChild(pitch_on);
        });
    }

    pitch_on = p_img(PIXI, {
        width: 25.6 * PIXI.ratio * 1.2,
        height: 18.4 * PIXI.ratio * 1.2,
        x: div_child_arr[0].width - (38.4 + 25.6 * 1.2) * PIXI.ratio,
        src: 'images/pitch_on.png'
    });
    pitch_on.setPositionFn({ relative_middle: { containerHeight: div_child_arr[0].height } });
    div_child_arr[0].addChild(pitch_on);

    divDeploy.height = div_child_arr[div_child_arr.length - 1].y + div_child_arr[div_child_arr.length - 1].height;

    div = p_box(PIXI, divDeploy);
    div.addChild(...div_child_arr);

    tipText.setPositionFn({ y: div.height + div.y + 29 * PIXI.ratio });

    // 点击保存 “按钮” 开始
    let button = p_button(PIXI, {
        width: 580 * PIXI.ratio,
        y: tipText.height + tipText.y + 60.5 * PIXI.ratio
    });
    button.myAddChildFn(
        p_text(PIXI, {
            content: '点击保存',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.onClickFn(() => {
        callBack({
            status: 'saveFile',
            index: div.getChildIndex(pitch_on.parent)
        });
    });
    // 点击保存 “按钮” 结束

    window.router.getNowPage(page => {
        page.reload = function() {
            logo.turnImg({ src: 'images/logo.png' });
            pitch_on.turnImg({ src: 'images/pitch_on.png' });
        };
    });

    container.addChild(goBack, title, api_name, underline, div, tipText, button, logo, logoName);
    app.stage.addChild(container);

    return container;
};
