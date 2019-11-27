import { p_button, p_text, p_line, p_box, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: '查看目录内容',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'readdir',
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
        pathBox = p_box(PIXI, {
            height: 88 * PIXI.ratio,
            border: { width: PIXI.ratio, color: 0xe5e5e5 },
            y: underline.height + underline.y + 61 * PIXI.ratio
        }),
        readdirButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: pathBox.height + pathBox.y + 107 * PIXI.ratio
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

    pathBox.addChild(
        p_text(PIXI, {
            content: '目录路径',
            fontSize: 34 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: pathBox.height }
        }),
        p_text(PIXI, {
            content: `${wx.env.USER_DATA_PATH}/fileA`,
            fontSize: 34 * PIXI.ratio,
            relative_middle: { containerWidth: pathBox.width, containerHeight: pathBox.height }
        })
    );

    function showListFn(pathArr) {
        let div,
            divDeploy = {
                height: 0,
                border: {
                    width: PIXI.ratio | 0,
                    color: 0xe5e5e5
                },
                y: pathBox.height + pathBox.y - PIXI.ratio
            },
            div_child_arr = [];

        for (let i = 0; i < pathArr.length; i++) {
            if (pathArr[i].path.length < 2) {
                pathArr.shift(), i--;
                continue;
            }

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
                    content: pathArr[i].stats.isFile() ? '文件' : '目录',
                    fontSize: 34 * PIXI.ratio,
                    x: 30 * PIXI.ratio,
                    relative_middle: { containerHeight: div_child_arr[i].height }
                }),
                p_text(PIXI, {
                    content: pathArr[i].path.replace('/', ''),
                    fontSize: 34 * PIXI.ratio,
                    x: 200 * PIXI.ratio,
                    relative_middle: {
                        containerWidth: div_child_arr[i].width,
                        containerHeight: div_child_arr[i].height
                    }
                })
            );
        }

        divDeploy.height = div_child_arr[div_child_arr.length - 1].y + div_child_arr[div_child_arr.length - 1].height;

        div = p_box(PIXI, divDeploy);
        div.addChild(...div_child_arr);
        container.addChild(div);
    }

    // 点击查看 “按钮” 开始
    readdirButton.myAddChildFn(
        p_text(PIXI, {
            content: '点击查看',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: readdirButton.width, containerHeight: readdirButton.height }
        })
    );
    readdirButton.onClickFn(() => {
        callBack({
            status: 'readdir',
            drawFn(path) {
                wx.getFileSystemManager().stat({
                    path,
                    recursive: true,
                    success(res) {
                        showListFn(res.stats);
                        readdirButton.hideFn();
                    }
                });
            }
        });
    });
    // 点击查看 “按钮” 结束

    container.addChild(goBack, title, api_name, underline, pathBox, readdirButton, logo, logoName);
    app.stage.addChild(container);

    return container;
};
