import { p_button, p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '获取文件信息',
            api_name: 'getFileInfo'
        }),
        pathBox = p_box(PIXI, {
            height: 88 * PIXI.ratio,
            border: { width: PIXI.ratio, color: 0xe5e5e5 },
            y: underline.height + underline.y + 61 * PIXI.ratio
        }),
        tipText = p_text(PIXI, {
            content: '提示：路径可以是代码包绝对路径、本地临时路\n径、本地路径和本地缓存路径',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: pathBox.height + pathBox.y + 24 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        getFileInfoButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: pathBox.height + pathBox.y + 166 * PIXI.ratio
        });

    pathBox.addChild(
        p_text(PIXI, {
            content: `路径`,
            fontSize: 34 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: pathBox.height }
        }),
        p_text(PIXI, {
            content: 'images/weapp.jpg',
            fontSize: 34 * PIXI.ratio,
            relative_middle: { containerWidth: pathBox.width, containerHeight: pathBox.height }
        })
    );

    // 获取文件信息 “按钮” 开始
    getFileInfoButton.myAddChildFn(
        p_text(PIXI, {
            content: '获取文件信息',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: getFileInfoButton.width, containerHeight: getFileInfoButton.height }
        })
    );
    getFileInfoButton.onClickFn(() => {
        callBack({ status: 'getFileInfo' });
    });
    // 获取文件信息 “按钮” 结束

    container.addChild(goBack, title, api_name, underline, pathBox, tipText, getFileInfoButton, logo, logoName);
    app.stage.addChild(container);

    return container;
};
