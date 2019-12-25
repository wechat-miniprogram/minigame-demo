import { p_button, p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '重命名',
            api_name: 'rename'
        }),
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

    goBack.callBack = () => {
        wx.getFileSystemManager().rmdir({
            dirPath: `${wx.env.USER_DATA_PATH}/newTestFile`,
            recursive: true
        });
    };

    container.addChild(goBack, title, api_name, underline, pathBox, tipText, renameButton, logo, logoName);
    app.stage.addChild(container);

    return container;
};
