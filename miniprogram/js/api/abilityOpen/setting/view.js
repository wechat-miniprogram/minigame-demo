import { p_button, p_scroll, p_text, p_box, p_line, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: '设置',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'open/get/Setting',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            y: 45 * PIXI.ratio,
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
        scroll = p_scroll(PIXI, {
            height: obj.height - 135 * (obj.height / 1334),
            y: 135 * (obj.height / 1334)
        }),
        logo = p_img(PIXI, {
            width: 36 * PIXI.ratio,
            height: 36 * PIXI.ratio,
            x: 294 * PIXI.ratio,
            y: 1374 * PIXI.ratio,
            src: 'images/logo.png'
        }),
        logoName = p_text(PIXI, {
            content: '小游戏示例',
            fontSize: 26 * PIXI.ratio,
            fill: 0x576b95,
            y: (1378 * PIXI.ratio) | 0,
            relative_middle: { point: 404 * PIXI.ratio }
        }),
        div;

    let settingObj = {
            'scope.userInfo': '用户信息',
            'scope.userLocation': '地理位置',
            'scope.address': '通讯地址',
            'scope.invoiceTitle': '发票抬头',
            'scope.werun': '微信运动步数',
            'scope.record': '录音功能',
            'scope.writePhotosAlbum': '保存到相册',
            'scope.camera': '摄像头'
        },
        divDeploy = {
            height: 0,
            border: {
                width: PIXI.ratio | 0,
                color: 0x999999
            },
            y: underline.height + underline.y + 70 * PIXI.ratio
        },
        div_container = new PIXI.Container(),
        div_container_child_arr = [];

    for (let i = 0, arr = Object.keys(settingObj), len = arr.length; i < len; i++) {
        div_container_child_arr[i] = p_box(PIXI, {
            height: 100 * PIXI.ratio,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: i ? div_container_child_arr[i - 1].height + div_container_child_arr[i - 1].y - (PIXI.ratio | 0) : 0
        });

        div_container_child_arr[i].addChild(
            p_text(PIXI, {
                content: settingObj[arr[i]],
                fontSize: 30 * PIXI.ratio,
                x: 30 * PIXI.ratio,
                relative_middle: { containerHeight: div_container_child_arr[i].height }
            }),
            (settingObj[arr[i]] = p_line(
                PIXI,
                {
                    width: 5 * PIXI.ratio,
                    color: 0x1aad19
                },
                [525 * PIXI.ratio, 50 * PIXI.ratio],
                [15 * PIXI.ratio, 15 * PIXI.ratio],
                [45 * PIXI.ratio, -15 * PIXI.ratio]
            ))
        );
        settingObj[arr[i]].visible = false;
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

    //获取小游戏设置“按钮” 开始
    let getSettingBtn = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        height: 80 * PIXI.ratio,
        y: 1020 * PIXI.ratio
    });
    getSettingBtn.addChild(
        p_text(PIXI, {
            content: '获取小游戏设置',
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            fontWeight: 'bold',
            relative_middle: { containerWidth: getSettingBtn.width, containerHeight: getSettingBtn.height }
        })
    );
    getSettingBtn.onClickFn(() => {
        callBack({
            status: 'getSetting',
            drawFn(data) {
                for (let i = 0, arr = Object.keys(settingObj), len = arr.length; i < len; i++) {
                    if (data[arr[i]]) {
                        settingObj[arr[i]].visible = true;
                    } else {
                        settingObj[arr[i]].visible = false;
                    }
                }
            }
        });
    });
    //获取小游戏设置“按钮” 结束

    //打开小游戏设置“按钮” 开始
    let openSettingBtn = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        height: 80 * PIXI.ratio,
        color: 0xeeeeee,
        y: 1120 * PIXI.ratio
    });
    openSettingBtn.addChild(
        p_text(PIXI, {
            content: '打开小游戏设置',
            fontSize: 30 * PIXI.ratio,
            fill: 0x1aad19,
            fontWeight: 'bold',
            relative_middle: { containerWidth: openSettingBtn.width, containerHeight: openSettingBtn.height }
        })
    );
    openSettingBtn.onClickFn(() => {
        callBack({
            status: 'openSetting',
            drawFn(data) {
                for (let i = 0, arr = Object.keys(settingObj), len = arr.length; i < len; i++) {
                    if (data[arr[i]]) {
                        settingObj[arr[i]].visible = true;
                    } else {
                        settingObj[arr[i]].visible = false;
                    }
                }
            }
        });
    });
    //打开小游戏设置“按钮” 结束

    scroll.myAddChildFn([
        api_name,
        underline,
        div,
        getSettingBtn,
        openSettingBtn,
        logo,
        logoName,
        p_box(PIXI, { y: 1440 * PIXI.ratio })
    ]);
    container.addChild(title, goBack, scroll);
    app.stage.addChild(container);

    return container;
};
