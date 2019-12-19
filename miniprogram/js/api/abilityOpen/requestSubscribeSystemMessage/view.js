import { p_button, p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '永久订阅',
            api_name: 'requestSubscribeSystemMessage'
        }),
        button = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
        });

    // 点击调起消息界面 “按钮” 开始
    button.myAddChildFn(
        p_text(PIXI, {
            content: `订阅消息`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.onClickFn(() => {
        callBack({
            status: 'requestSubscribeSystemMessage',
            drawFn(msgObj) {
                modalBox.showFn();
                button.isTouchable(false);
                goBack.isTouchable(false);

                let box = modalDetails.getChildByName('textBox'),
                    text;
                box && modalDetails.removeChild(box).destroy(true);
                box = new PIXI.Container();
                box.name = 'textBox';

                Object.keys(msgObj).forEach((item, index) => {
                    text = p_text(PIXI, {
                        content: item,
                        fontSize: 32 * PIXI.ratio,
                        fill: '0x999999',
                        x: 30 * PIXI.ratio,
                        y: index ? text.y + text.height + 10 * PIXI.ratio : 120 * PIXI.ratio
                    });
                    box.addChild(text);
                    text = p_text(PIXI, {
                        content: msgObj[item],
                        fontSize: 32 * PIXI.ratio,
                        fill: text.style.fill,
                        y: text.y
                    });
                    text.setPositionFn({ x: modalDetails.width - text.width - 30 * PIXI.ratio });
                    box.addChild(text);
                });

                modalDetails.addChild(box);
            }
        });
    });
    // 点击调起消息界面 “按钮” 结束

    // 模态对话框 开始
    let modalBox = p_box(PIXI, {
            height: obj.height,
            background: { color: 0x000000, alpha: 0.5 }
        }),
        modalDetails = p_box(PIXI, {
            width: 560 * PIXI.ratio,
            height: 353 * PIXI.ratio,
            y: (modalBox.height - 553 * PIXI.ratio) / 2
        }),
        modalButton = p_button(PIXI, {
            width: modalDetails.width,
            height: 100 * PIXI.ratio,
            parentWidth: modalDetails.width,
            border: { width: PIXI.ratio | 0, color: 0xd2d3d5 },
            y: modalDetails.height - 100 * PIXI.ratio,
            alpha: 0
        });
    modalDetails.mask = p_box(PIXI, {
        width: modalDetails.width,
        height: modalDetails.height,
        radius: 8 * PIXI.ratio,
        parentWidth: modalDetails.width
    });
    modalButton.myAddChildFn(
        p_text(PIXI, {
            content: `确定`,
            fontSize: 36 * PIXI.ratio,
            fill: 0x02bb00,
            relative_middle: { containerWidth: modalButton.width, containerHeight: modalButton.height }
        })
    );
    modalButton.onClickFn(() => {
        modalBox.hideFn();
        button.isTouchable(true);
        goBack.isTouchable(true);
    });
    modalDetails.addChild(
        modalDetails.mask,
        p_text(PIXI, {
            content: '提示',
            fontSize: 36 * PIXI.ratio,
            y: 57 * PIXI.ratio,
            relative_middle: { point: modalDetails.width / 2 }
        }),
        modalButton
    );
    modalBox.addChild(modalDetails);
    modalBox.hideFn();
    // 模态对话框 结束

    container.addChild(goBack, title, api_name, underline, button, logo, logoName, modalBox);

    app.stage.addChild(container);

    return container;
};
