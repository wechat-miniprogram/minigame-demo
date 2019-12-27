import { p_button, p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '创建/删除目录',
            api_name: 'mk/rm/dir'
        }),
        mkdirButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
        }),
        div = new PIXI.Container(),
        pathBox = p_box(PIXI, {
            height: 92.5 * PIXI.ratio,
            border: { width: PIXI.ratio, color: 0xe5e5e5 },
            y: underline.height + underline.y + 102 * PIXI.ratio
        }),
        tipText = p_text(PIXI, {
            content: '提示：上面显示的路径是已创建了的',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            y: underline.height + underline.y + 213 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        rmdirButton = p_button(PIXI, {
            width: mkdirButton.width,
            y: tipText.height + tipText.y + 60 * PIXI.ratio
        });

    pathBox.addChild(
        p_text(PIXI, {
            content: `${wx.env.USER_DATA_PATH}/fileA`,
            fontSize: 36 * PIXI.ratio,
            relative_middle: { containerWidth: pathBox.width, containerHeight: pathBox.height }
        })
    );

    // 创建目录“按钮” 开始
    mkdirButton.myAddChildFn(
        p_text(PIXI, {
            content: '创建目录',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: mkdirButton.width, containerHeight: mkdirButton.height }
        })
    );
    mkdirButton.onClickFn(() => {
        callBack({
            status: 'mkdir',
            drawFn() {
                div.visible = !div.visible;
                mkdirButton.hideFn();
            }
        });
    });
    // 创建目录“按钮” 结束

    // 创建目录“按钮” 开始
    rmdirButton.myAddChildFn(
        p_text(PIXI, {
            content: '删除目录',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: rmdirButton.width, containerHeight: rmdirButton.height }
        })
    );
    rmdirButton.onClickFn(() => {
        callBack({
            status: 'rmdir',
            drawFn() {
                div.visible = !div.visible;
                mkdirButton.showFn();
            }
        });
    });
    // 创建目录“按钮” 结束

    div.visible = false;
    mkdirButton.hideFn();
    wx.getFileSystemManager().access({
        path: `${wx.env.USER_DATA_PATH}/fileA`,
        success() {
            div.visible = true;
        },
        fail() {
            div.visible = false;
            mkdirButton.showFn();
        }
    });

    div.addChild(pathBox, tipText, rmdirButton);
    container.addChild(goBack, title, api_name, underline, div, mkdirButton, logo, logoName);
    app.stage.addChild(container);

    return container;
};
