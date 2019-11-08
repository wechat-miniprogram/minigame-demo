import { p_button, p_text, p_line, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: '显示模态弹窗',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'showModal',
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
