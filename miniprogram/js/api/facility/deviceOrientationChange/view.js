import { p_button, p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '横竖屏切换',
            api_name: 'on/off/DeviceOrientationChange'
        }),
        div = p_box(PIXI, {
            height: 404 * PIXI.ratio,
            y: underline.y + underline.height + 80 * PIXI.ratio
        }),
        text = p_text(PIXI, {
            content: '切换屏事件未触发',
            fontSize: 42 * PIXI.ratio,
            fill: 0xcecece,
            y: 233 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        });

    div.addChild(
        p_text(PIXI, {
            content: '请旋转屏幕',
            fontSize: 32 * PIXI.ratio,
            y: 61 * PIXI.ratio,
            fill: 0x353535,
            relative_middle: { containerWidth: div.width }
        }),
        text
    );

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
        y: div.height + div.y + 314 * PIXI.ratio
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
                status: 'onDeviceOrientationChange',
                drawFn() {
                    text.turnText('切换屏事件已触发');
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
            status: 'offDeviceOrientationChange'
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

    run();

    container.addChild(goBack, title, api_name, underline, div, startListening, stopListening, logo, logoName);
    app.stage.addChild(container);

    return container;
};
