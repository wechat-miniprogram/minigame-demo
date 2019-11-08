import { p_text, p_box, p_line, p_img, p_goBackBtn } from '../../../libs/component/index';
import share from '../../../libs/share';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage', () => {
            callBack({
                status: 'offShareAppMessage'
            });
            share();
        }),
        title = p_text(PIXI, {
            content: '转发',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'onShareAppMessage',
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
        transpondText = p_text(PIXI, {
            content: '发送内容 （以下字段可自由适配）',
            fontSize: 26 * PIXI.ratio,
            fill: 0x9f9f9f,
            x: 30 * PIXI.ratio,
            y: underline.height + underline.y + 101 * PIXI.ratio
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

    divDeploy.height =
        div_container_child_arr[div_container_child_arr.length - 1].y +
        div_container_child_arr[div_container_child_arr.length - 1].height;

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

    container.addChild(goBack, title, api_name, underline, transpondText, div, tip, logo, logoName);
    container.visible = false;
    app.stage.addChild(container);

    return container;
};
