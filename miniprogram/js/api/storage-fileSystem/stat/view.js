import { p_button, p_text, p_box, p_img } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '判断文件路径是否是目录',
            api_name: 'stat'
        }),
        statButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 336 * PIXI.ratio
        }),
        pitch_on,
        div;

    let pathArr = [`${wx.env.USER_DATA_PATH}`, `${wx.env.USER_DATA_PATH}/fileA/hello.txt`],
        divDeploy = {
            height: 0,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: underline.height + underline.y + 78 * PIXI.ratio
        },
        div_child_arr = [];

    for (let i = 0, len = pathArr.length; i < len; i++) {
        div_child_arr[i] = p_box(PIXI, {
            height: 88 * PIXI.ratio,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: i && div_child_arr[i - 1].height + div_child_arr[i - 1].y - (PIXI.ratio | 0)
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

    // 点击判断 “按钮” 开始
    statButton.myAddChildFn(
        p_text(PIXI, {
            content: '点击判断',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: statButton.width, containerHeight: statButton.height }
        })
    );
    statButton.onClickFn(() => {
        callBack({ status: 'stat', index: div.getChildIndex(pitch_on.parent) });
    });
    // 点击判断 “按钮” 结束

    container.addChild(goBack, title, api_name, underline, div, statButton, logo, logoName);
    app.stage.addChild(container);

    return container;
};
