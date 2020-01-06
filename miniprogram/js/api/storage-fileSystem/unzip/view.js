import { p_button, p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '解压文件',
            api_name: 'unzip'
        }),
        pathBox = p_box(PIXI, {
            height: 88 * PIXI.ratio,
            border: { width: PIXI.ratio, color: 0xe5e5e5 },
            y: underline.height + underline.y + 61 * PIXI.ratio
        }),
        tipText = p_text(PIXI, {
            content: `提示：把压缩包的内容解压到\n路径 ${JSON.stringify(wx.env.USER_DATA_PATH + '/fileA')} 下`,
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: pathBox.height + pathBox.y + 24 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        unzipFileButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: pathBox.height + pathBox.y + 166 * PIXI.ratio
        });

    pathBox.addChild(
        p_text(PIXI, {
            content: `压缩包`,
            fontSize: 34 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: pathBox.height }
        }),
        p_text(PIXI, {
            content: 'test.zip',
            fontSize: 34 * PIXI.ratio,
            relative_middle: { containerWidth: pathBox.width, containerHeight: pathBox.height }
        })
    );

    // 解压文件 “按钮” 开始
    unzipFileButton.myAddChildFn(
        p_text(PIXI, {
            content: '解压文件',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: unzipFileButton.width, containerHeight: unzipFileButton.height }
        })
    );
    unzipFileButton.onClickFn(() => {
        callBack({ status: 'unzip' });
    });
    // 解压文件 “按钮” 结束

    container.addChild(goBack, title, api_name, underline, pathBox, tipText, unzipFileButton, logo, logoName);
    app.stage.addChild(container);

    return container;
};
