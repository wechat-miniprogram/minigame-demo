import { p_text, p_button, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '监听设备方向',
            api_name: 'on/off/DeviceMotionChange'
        }),
        div = p_box(PIXI, {
            width: 600 * PIXI.ratio,
            height: 372 * PIXI.ratio,
            y: underline.y + underline.height + 80 * PIXI.ratio
        }),
        text = p_text(PIXI, {
            content: `α：${0} rad\nβ：${0} rad\nγ：${0} rad`,
            fontSize: 30 * PIXI.ratio,
            align: 'center',
            fill: 0x353535,
            y: 93 * PIXI.ratio,
            lineHeight: 72 * PIXI.ratio,
            relative_middle: { containerWidth: div.width }
        });

    div.addChild(text);

    //开始监听“按钮” 开始
    let startListening = p_button(PIXI, {
        width: 296 * PIXI.ratio,
        height: 66 * PIXI.ratio,
        border: {
            width: 2 * PIXI.ratio,
            color: 0x353535
        },
        radius: 10 * PIXI.ratio,
        alpha: 0,
        x: 63 * PIXI.ratio,
        y: div.height + div.y + 348 * PIXI.ratio
    });
    startListening.myAddChildFn(
        p_text(PIXI, {
            content: '开始监听',
            fontSize: 32 * PIXI.ratio,
            fill: 0x353535,
            relative_middle: { containerWidth: startListening.width, containerHeight: startListening.height }
        })
    );
    let run;
    startListening.onClickFn(
        (run = () => {
            switch_button_state({ button: startListening, boolead: false, color: 0xe9e9e9 }, { button: stopListening, boolead: true, color: 0x353535 });
            callBack({
                status: 'onDeviceMotionChange',
                drawFn(res) {
                    text.turnText(`α：${res.alpha} rad\nβ：${res.beta} rad\nγ：${res.gamma} rad`);
                }
            });
        })
    );
    //开始监听“按钮” 结束

    //停止监听“按钮” 开始
    let stopListening = p_button(PIXI, {
        width: 296 * PIXI.ratio,
        height: 66 * PIXI.ratio,
        border: {
            width: 2 * PIXI.ratio,
            color: 0xe9e9e9
        },
        radius: 10 * PIXI.ratio,
        alpha: 0,
        x: obj.width - 357 * PIXI.ratio,
        y: startListening.y
    });
    stopListening.myAddChildFn(
        p_text(PIXI, {
            content: '停止监听',
            fontSize: 32 * PIXI.ratio,
            fill: 0xe9e9e9,
            relative_middle: { containerWidth: stopListening.width, containerHeight: stopListening.height }
        })
    );
    stopListening.onClickFn(() => {
        switch_button_state({ button: stopListening, boolead: false, color: 0xe9e9e9 }, { button: startListening, boolead: true, color: 0x353535 });
        callBack({
            status: 'offDeviceMotionChange'
        });
    });
    stopListening.isTouchable(false);
    //停止监听“按钮” 结束

    // 切换“按钮”状态函数 开始
    function switch_button_state(...arr) {
        while (arr.length) {
            let item = arr.shift();
            item.button.isTouchable(item.boolead);
            item.button.turnColors({ border: { color: item.color } });
            item.button.children[0].children[0].turnColors(item.color);
        }
    }
    // 切换“按钮”状态函数 结束

    goBack.callBack = () => {
        switch_button_state({ button: stopListening, boolead: false, color: 0xe9e9e9 }, { button: startListening, boolead: true, color: 0x353535 });
        callBack({
            status: 'offDeviceMotionChange'
        });
    };

    if (wx.offDeviceMotionChange) run();
    else {
        run();

        window.router.getNowPage(page => {
            page.reload = function() {
                logo.reloadImg({ src: 'images/logo.png' });
                run();
            };
        });
    }

    container.addChild(goBack, title, api_name, underline, div, startListening, stopListening, logo, logoName);
    app.stage.addChild(container);

    return container;
};
