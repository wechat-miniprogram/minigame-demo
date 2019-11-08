import { p_button, p_text, p_box, p_line, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: '剪贴板',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'get/set/ClipboardData',
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

    let clipboard = {
            Copy: Math.random()
                .toString(36)
                .substr(2),
            Paste: ''
        },
        divDeploy = {
            height: 0,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: underline.height + underline.y + 101 * PIXI.ratio
        },
        div_container = new PIXI.Container(),
        div_container_child_arr = [];

    for (let i = 0, arr = Object.keys(clipboard), len = arr.length; i < len; i++) {
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
                fontSize: 34 * PIXI.ratio,
                x: 30 * PIXI.ratio,
                relative_middle: { containerHeight: div_container_child_arr[i].height }
            }),
            (clipboard[arr[i]] = p_text(PIXI, {
                content: clipboard[arr[i]],
                fontSize: 34 * PIXI.ratio,
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

    // 复制 “按钮” 开始
    let copyButton = p_button(PIXI, {
        width: 580 * PIXI.ratio,
        y: div.y + div.height + 80 * PIXI.ratio
    });
    copyButton.myAddChildFn(
        p_text(PIXI, {
            content: '复制',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: copyButton.width, containerHeight: copyButton.height }
        })
    );
    copyButton.onClickFn(() => {
        callBack({
            status: 'setClipboardData',
            value: clipboard.Copy.text,
            drawFn() {
                !pasteButton.interactive && switch_button_state([pasteButton, update_string_button], 0x353535, true);
            }
        });
    });
    // 复制 “按钮” 结束

    // 粘贴 “按钮” 开始
    let pasteButton = p_button(PIXI, {
        width: 576 * PIXI.ratio,
        height: 90 * PIXI.ratio,
        border: {
            width: 2 * PIXI.ratio,
            color: 0xd1d1d1
        },
        alpha: 0,
        y: copyButton.y + copyButton.height + 32 * PIXI.ratio
    });
    pasteButton.myAddChildFn(
        p_text(PIXI, {
            content: '粘贴',
            fontSize: 36 * PIXI.ratio,
            fill: 0xbebebe,
            relative_middle: { containerWidth: pasteButton.width, containerHeight: pasteButton.height }
        })
    );
    pasteButton.onClickFn(() => {
        callBack({
            status: 'getClipboardData',
            drawFn(value) {
                clipboard.Paste.turnText(value);
            }
        });
    });
    pasteButton.isTouchable(false);
    // 粘贴 “按钮” 结束

    // 更新字符串 “按钮” 开始
    let update_string_button = p_button(PIXI, {
        width: 576 * PIXI.ratio,
        height: 90 * PIXI.ratio,
        border: {
            width: 2 * PIXI.ratio,
            color: 0xd1d1d1
        },
        alpha: 0,
        y: pasteButton.y + pasteButton.height + 34 * PIXI.ratio
    });
    update_string_button.myAddChildFn(
        p_text(PIXI, {
            content: '更新字符串',
            fontSize: 36 * PIXI.ratio,
            fill: 0xbebebe,
            relative_middle: {
                containerWidth: update_string_button.width,
                containerHeight: update_string_button.height
            }
        })
    );
    update_string_button.onClickFn(() => {
        clipboard.Copy.turnText(
            Math.random()
                .toString(36)
                .substr(2)
        );
    });
    update_string_button.isTouchable(false);
    // 更新字符串 “按钮” 结束

    // 切换“按钮”状态函数 开始
    function switch_button_state(buttonArr, color, boolead) {
        while (buttonArr.length) {
            let item = buttonArr.shift();
            item.isTouchable(boolead);
            item.children[0].children[0].turnColors(color);
        }
    }
    // 切换“按钮”状态函数 结束

    container.addChild(
        goBack,
        title,
        api_name,
        underline,
        div,
        copyButton,
        pasteButton,
        update_string_button,
        logo,
        logoName
    );
    container.visible = false;
    app.stage.addChild(container);

    return container;
};
