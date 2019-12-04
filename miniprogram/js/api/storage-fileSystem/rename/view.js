import { p_button, p_text, p_line, p_box, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage', () => {
            wx.getFileSystemManager().rmdir({
                dirPath: `${wx.env.USER_DATA_PATH}/newTestFile`,
                recursive: true
            });
        }),
        title = p_text(PIXI, {
            content: '重命名',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'rename',
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
        tipText = p_text(PIXI, {
            content: '提示： 可以把文件夹、文件从 oldPath 移动到\nnewPath',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: pathBox.height + pathBox.y + 37 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        renameButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: pathBox.height + pathBox.y + 187 * PIXI.ratio
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

    let path,
        pathArr = [`${wx.env.USER_DATA_PATH}/fileA`, `${wx.env.USER_DATA_PATH}/newTestFile`];

    pathBox.addChild(
        p_text(PIXI, {
            content: '目录路径',
            fontSize: 34 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: pathBox.height }
        }),
        (path = p_text(PIXI, {
            content: pathArr[0],
            fontSize: 34 * PIXI.ratio,
            relative_middle: { containerWidth: pathBox.width, containerHeight: pathBox.height }
        }))
    );

    // 重命名 “按钮” 开始
    renameButton.myAddChildFn(
        p_text(PIXI, {
            content: '重命名',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: renameButton.width, containerHeight: renameButton.height }
        })
    );
    renameButton.onClickFn(() => {
        callBack({
            status: 'rename',
            pathArr,
            drawFn() {
                pathArr = [pathArr[1], pathArr[0]];
                path.turnText(pathArr[0]);
            }
        });
    });
    // 重命名 “按钮” 结束

    container.addChild(goBack, title, api_name, underline, pathBox, tipText, renameButton, logo, logoName);
    app.stage.addChild(container);

    return container;
};
