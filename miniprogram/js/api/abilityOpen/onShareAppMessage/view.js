import { p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
import share from '../../../libs/share';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '转发',
            api_name: 'onShareAppMessage'
        }),
        transpondText = p_text(PIXI, {
            content: '发送内容 （以下字段可自由适配）',
            fontSize: 26 * PIXI.ratio,
            fill: 0x9f9f9f,
            x: 30 * PIXI.ratio,
            y: underline.height + underline.y + 101 * PIXI.ratio
        }),
        div;

    let transpond = {
            标题: '自定义转发标题',
            描述: '自定义转发描述',
            跳转页面: '当前小游戏示例'
        },
        divDeploy = {
            height: 0,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: transpondText.height + transpondText.y + 10 * PIXI.ratio
        },
        div_container = new PIXI.Container(),
        div_container_child_arr = [];

    for (let i = 0, arr = Object.keys(transpond), len = arr.length; i < len; i++) {
        div_container_child_arr[i] = p_box(PIXI, {
            height: i ? 93 * PIXI.ratio : 87 * PIXI.ratio,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: i ? div_container_child_arr[i - 1].height + div_container_child_arr[i - 1].y - (PIXI.ratio | 0) : 0
        });

        div_container_child_arr[i].addChild(
            p_text(PIXI, {
                content: arr[i],
                fontSize: 32 * PIXI.ratio,
                fill: 0x353535,
                x: 30 * PIXI.ratio,
                relative_middle: { containerHeight: div_container_child_arr[i].height }
            }),
            (transpond[arr[i]] = p_text(PIXI, {
                content: transpond[arr[i]],
                fontSize: 32 * PIXI.ratio,
                fill: 0x353535,
                relative_middle: {
                    containerWidth: div_container_child_arr[i].width,
                    containerHeight: div_container_child_arr[i].height
                }
            }))
        );
    }

    divDeploy.height = div_container_child_arr[div_container_child_arr.length - 1].y + div_container_child_arr[div_container_child_arr.length - 1].height;

    div = p_box(PIXI, divDeploy);
    div_container.addChild(...div_container_child_arr);
    div_container.mask = p_box(PIXI, {
        width: div.width - 30 * PIXI.ratio,
        height: divDeploy.height - 2 * PIXI.ratio,
        x: 30 * PIXI.ratio
    });
    div.addChild(div_container, div_container.mask);

    let tip = p_text(PIXI, {
        content: '点击右上角菜单转发给好友',
        fontSize: 26 * PIXI.ratio,
        fill: 0x9f9f9f,
        x: 30 * PIXI.ratio,
        y: div.height + div.y + 10 * PIXI.ratio
    });

    // 加载监听被动调起分享 开始
    callBack({
        status: 'onShareAppMessage'
    });
    // 加载监听被动调起分享 结束

    goBack.callBack = () => {
        callBack({
            status: 'offShareAppMessage'
        });
        share();
    };

    container.addChild(goBack, title, api_name, underline, transpondText, div, tip, logo, logoName);
    container.visible = false;
    app.stage.addChild(container);

    return container;
};
