import { p_button, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '显示模态弹窗',
            api_name: 'showModal'
        });

    //有标题的模态弹窗“按钮” 开始
    let with_title_btn = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        height: 80 * PIXI.ratio,
        color: 0xeeeeee,
        y: underline.y + underline.height + 150 * PIXI.ratio
    });
    with_title_btn.addChild(
        p_text(PIXI, {
            content: '有标题的modal',
            fontSize: 30 * PIXI.ratio,
            fill: 0x1aad19,
            fontWeight: 'bold',
            relative_middle: { containerWidth: with_title_btn.width, containerHeight: with_title_btn.height }
        })
    );
    with_title_btn.onClickFn(() => {
        callBack({
            status: 'with title'
        });
    });
    //有标题的模态弹窗“按钮” 结束

    //无标题的模态弹窗“按钮” 开始
    let without_title_btn = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        height: 80 * PIXI.ratio,
        color: 0xeeeeee,
        y: with_title_btn.y + with_title_btn.height + 20 * PIXI.ratio
    });
    without_title_btn.addChild(
        p_text(PIXI, {
            content: '无标题的modal',
            fontSize: 30 * PIXI.ratio,
            fill: 0x1aad19,
            fontWeight: 'bold',
            relative_middle: { containerWidth: without_title_btn.width, containerHeight: without_title_btn.height }
        })
    );
    without_title_btn.onClickFn(() => {
        callBack({
            status: 'without title'
        });
    });
    //无标题的模态弹窗“按钮” 结束

    container.addChild(goBack, title, api_name, underline, with_title_btn, without_title_btn, logo, logoName);
    app.stage.addChild(container);

    return container;
};
