import { p_button, p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '查看目录内容',
            api_name: 'readdir'
        }),
        pathBox = p_box(PIXI, {
            height: 88 * PIXI.ratio,
            border: { width: PIXI.ratio, color: 0xe5e5e5 },
            y: underline.height + underline.y + 61 * PIXI.ratio
        }),
        readdirButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: pathBox.height + pathBox.y + 107 * PIXI.ratio
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
