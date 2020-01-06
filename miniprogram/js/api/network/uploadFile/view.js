import { p_text, p_line, p_box, p_img } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '上传文件',
            api_name: 'uploadFile'
        }),
        box = p_box(PIXI, {
            y: underline.y + underline.height + 150 * PIXI.ratio,
            height: obj.width / 2,
            border: {
                width: PIXI.ratio | 0,
                color: 0x999999
            }
        }),
        box_child = new PIXI.Container(),
        sprite = null;

    box_child.y = -20 * PIXI.ratio;
    box_child.addChild(
        p_line(
            PIXI,
            {
                width: 4 * PIXI.ratio,
                color: 0x999999
            },
            [(obj.width - obj.width / 8) / 2, box.height / 2],
            [obj.width / 8, 0]
        ),
        p_line(
            PIXI,
            {
                width: 4 * PIXI.ratio,
                color: 0x999999
            },
            [obj.width / 2, (box.height - obj.width / 8) / 2],
            [0, obj.width / 8]
        ),
        p_text(PIXI, {
            content: '选择图片',
            fontSize: 28 * PIXI.ratio,
            fill: 0x999999,
            y: box.height - obj.width / 6,
            relative_middle: { containerWidth: box.width }
        })
    );

    box.addChild(box_child);
    box.onClickFn(() => {
        box.interactive = false;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success(res) {
                console.log('chooseImage success, temp path is', res.tempFilePaths[0]);
                const imageSrc = res.tempFilePaths[0];
                callBack(imageSrc, bool => {
                    if (bool) {
                        PIXI.loader.add(imageSrc).load(() => {
                            let width = void 0,
                                height = void 0;
                            sprite = p_img(PIXI, {
                                src: imageSrc,
                                is_PIXI_loader: true,
                                y: -PIXI.ratio | 0
                            });
                            if (sprite.width > sprite.height) {
                                width = box.width;
                                height = (width * sprite.height) / sprite.width;
                                if (box.height / height < 1) {
                                    width = (box.height * width) / height;
                                    height = box.height - ~~PIXI.ratio * 3;
                                }
                            } else {
                                width = (box.height * sprite.width) / sprite.height;
                                height = box.height - ~~PIXI.ratio * 3;
                            }
                            sprite.width = width;
                            sprite.height = height;
                            sprite.setPositionFn({
                                relative_middle: { containerWidth: box.width, containerHeight: box.height }
                            });
                            box_child.visible = false;
                            box.addChild(sprite);
                        });
                        return;
                    }
                    box.interactive = true;
                });
            },
            fail({ errMsg }) {
                box.interactive = true;
                console.log('chooseImage fail, err is', errMsg);
            }
        });
    });

    container.addChild(goBack, title, api_name, underline, box, logo, logoName);

    app.stage.addChild(container);

    return container;
};
