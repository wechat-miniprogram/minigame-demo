import { p_text, p_img, p_box, p_button } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '截图生成一个临时文件',
            api_name: 'toTempFilePath'
        }),
        box = p_box(PIXI, {
            height: 372 * PIXI.ratio,
            y: underline.y + underline.height + 23 * PIXI.ratio
        }),
        img = p_img(PIXI, {
            width: 620 * PIXI.ratio,
            height: 224 * PIXI.ratio,
            src: 'images/weapp.jpg',
            relative_middle: { containerWidth: box.width, containerHeight: box.height }
        }),
        tipText = p_text(PIXI, {
            content:
                '提示：一但使用了开放数据域，生成后的文件仅\n能被wx.saveImageToPhotosAlbum、wx.share\nAppMessage、wx.onShareAppMessage\n这些接口调用',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: box.height + box.y + 50 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        button = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: tipText.height + tipText.y + 50 * PIXI.ratio
        });

    box.addChild(img);

    // 截图生成一个临时文件 “按钮” 开始
    button.myAddChildFn(
        p_text(PIXI, {
            content: `截图生成一个临时文件`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.onClickFn(() => {
        callBack({
            status: 'toTempFilePath',
            deploy: {
                x: img.x,
                y: box.y + img.y,
                width: img.width,
                height: img.height
            }
        });
    });
    // 截图生成一个临时文件 “按钮” 结束

    container.addChild(goBack, title, api_name, underline, box, tipText, button, logo, logoName);

    app.stage.addChild(container);

    return container;
};
