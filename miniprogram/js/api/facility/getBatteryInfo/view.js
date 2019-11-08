import { p_button, p_text, p_box, p_line, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: '电量',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'getBatteryInfo',
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

    let batteryInfo = {
            level: '当前电量',
            isCharging: '当前电池状态'
        },
        divDeploy = {
            height: 0,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: underline.height + underline.y + 75 * PIXI.ratio
        },
        div_container = new PIXI.Container(),
        div_container_child_arr = [];

    for (let i = 0, arr = Object.keys(batteryInfo), len = arr.length; i < len; i++) {
        div_container_child_arr[i] = p_box(PIXI, {
            height: 87 * PIXI.ratio,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: i ? div_container_child_arr[i - 1].height + div_container_child_arr[i - 1].y - (PIXI.ratio | 0) : 0
        });

        div_container_child_arr[i].addChild(
            p_text(PIXI, {
                content: batteryInfo[arr[i]],
                fontSize: 34 * PIXI.ratio,
                x: 30 * PIXI.ratio,
                relative_middle: { containerHeight: div_container_child_arr[i].height }
            }),
            (batteryInfo[arr[i]] = p_text(PIXI, {
                content: '未获取',
                fontSize: 34 * PIXI.ratio,
                fill: 0xbebebe,
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

    // 获取手机电池状态“按钮” 开始
    let getBatteryInfoBtn = p_button(PIXI, {
        width: 540 * PIXI.ratio,
        y: div.height + div.y + 80 * PIXI.ratio
    });
    getBatteryInfoBtn.addChild(
        p_text(PIXI, {
            content: '获取手机电池状态',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: getBatteryInfoBtn.width, containerHeight: getBatteryInfoBtn.height }
        })
    );
    getBatteryInfoBtn.onClickFn(() => {
        callBack({
            status: 'getBatteryInfo',
            drawFn(data) {
                for (let i = 0, arr = Object.keys(batteryInfo), len = arr.length; i < len; i++) {
                    batteryInfo[arr[i]].turnColors(0x000000);
                    if (typeof data[arr[i]] === 'boolean') {
                        batteryInfo[arr[i]].turnText(data[arr[i]] ? '充电中' : '耗电中');
                        continue;
                    }
                    batteryInfo[arr[i]].turnText(data[arr[i]] + '%');
                }
            }
        });
    });
    // 获取手机电池状态“按钮” 结束

    // 清空“按钮” 开始
    let emptyBtn = p_button(PIXI, {
        width: 540 * PIXI.ratio,
        alpha: 0,
        y: getBatteryInfoBtn.height + getBatteryInfoBtn.y + 30 * PIXI.ratio
    });
    emptyBtn.addChild(
        p_text(PIXI, {
            content: '清空',
            fontSize: 34 * PIXI.ratio,
            relative_middle: { containerWidth: emptyBtn.width, containerHeight: emptyBtn.height }
        })
    );
    emptyBtn.onClickFn(() => {
        for (let i = 0, arr = Object.keys(batteryInfo), len = arr.length; i < len; i++) {
            batteryInfo[arr[i]].turnColors(0xbebebe);
            batteryInfo[arr[i]].turnText('未获取');
        }
    });
    // 清空“按钮” 结束

    container.addChild(goBack, title, api_name, underline, div, getBatteryInfoBtn, emptyBtn, logo, logoName);
    container.visible = false;
    app.stage.addChild(container);

    return container;
};
