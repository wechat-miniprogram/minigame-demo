import { p_button, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '显示消息提示框',
            api_name: 'showToast'
        });
    //点击弹出默认toast“按钮” 开始
    let toast1Tap = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        height: 120 * PIXI.ratio,
        color: 0xeeeeee,
        y: underline.y + underline.height + 100 * PIXI.ratio
    });
    toast1Tap.addChild(
        p_text(PIXI, {
            content: '点击弹出默认\ntoast',
            fontSize: 30 * PIXI.ratio,
            fill: 0x1aad19,
            fontWeight: 'bold',
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            vertical_center_correction_value: 13 * PIXI.ratio,
            relative_middle: { containerWidth: toast1Tap.width, containerHeight: toast1Tap.height }
        })
    );
    toast1Tap.onClickFn(() => {
        callBack({
            status: 'toast1Tap'
        });
    });
    //点击弹出默认toast“按钮” 结束

    //点击弹出设置duration的toast“按钮” 开始
    let toast2Tap = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        height: 120 * PIXI.ratio,
        color: 0xeeeeee,
        y: toast1Tap.y + toast1Tap.height + 20 * PIXI.ratio
    });
    toast2Tap.addChild(
        p_text(PIXI, {
            content: '点击弹出设置\nduration的toast',
            fontSize: 30 * PIXI.ratio,
            fill: 0x1aad19,
            fontWeight: 'bold',
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            vertical_center_correction_value: 10 * PIXI.ratio,
            relative_middle: { containerWidth: toast2Tap.width, containerHeight: toast2Tap.height }
        })
    );
    toast2Tap.onClickFn(() => {
        callBack({
            status: 'toast2Tap'
        });
    });
    //点击弹出设置duration的toast“按钮” 结束

    //点击弹出显示loading的toast“按钮” 开始
    let toast3Tap = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        height: 120 * PIXI.ratio,
        color: 0xeeeeee,
        y: toast2Tap.y + toast2Tap.height + 20 * PIXI.ratio
    });
    toast3Tap.addChild(
        p_text(PIXI, {
            content: '点击弹出设置\nloading的toast',
            fontSize: 30 * PIXI.ratio,
            fill: 0x1aad19,
            fontWeight: 'bold',
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            vertical_center_correction_value: 10 * PIXI.ratio,
            relative_middle: { containerWidth: toast3Tap.width, containerHeight: toast3Tap.height }
        })
    );
    toast3Tap.onClickFn(() => {
        callBack({
            status: 'toast3Tap'
        });
    });
    //点击弹出显示loading的toast“按钮” 结束

    //点击隐藏toast“按钮” 开始
    let hideToast = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        height: 80 * PIXI.ratio,
        color: 0xeeeeee,
        y: toast3Tap.y + toast3Tap.height + 20 * PIXI.ratio
    });
    hideToast.addChild(
        p_text(PIXI, {
            content: '点击隐藏toast',
            fontSize: 30 * PIXI.ratio,
            fill: 0x1aad19,
            fontWeight: 'bold',
            relative_middle: { containerWidth: hideToast.width, containerHeight: hideToast.height }
        })
    );
    hideToast.onClickFn(() => {
        callBack({
            status: 'hideToast'
        });
    });
    //点击隐藏toast“按钮” 结束

    goBack.callBack = wx.hideToast;

    container.addChild(goBack, title, api_name, underline, toast1Tap, toast2Tap, toast3Tap, hideToast, logo, logoName);
    app.stage.addChild(container);

    return container;
};
