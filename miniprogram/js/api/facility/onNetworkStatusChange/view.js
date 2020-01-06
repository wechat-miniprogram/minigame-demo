import { p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '监听手机网络变化',
            api_name: 'onNetworkStatusChange'
        }),
        div = p_box(PIXI, {
            height: 400 * PIXI.ratio,
            y: underline.y + underline.height + 80 * PIXI.ratio
        }),
        network_state_text = p_text(PIXI, {
            content: '',
            fontSize: 60 * PIXI.ratio,
            align: 'center',
            y: 220 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        });

    div.addChild(
        p_text(PIXI, {
            content: '网络状态',
            fontSize: 30 * PIXI.ratio,
            y: 50 * PIXI.ratio,
            relative_middle: { containerWidth: div.width }
        }),
        network_state_text
    );

    callBack({
        status: 'onNetworkStatusChange',
        drawFn(res) {
            network_state_text.turnText(
                {
                    wifi: 'wifi',
                    '2g': '2g',
                    '3g': '3g',
                    '4g': '4g',
                    unknown: '不常见的未知网络',
                    none: '无网络'
                }[res.networkType]
            );
        }
    });

    container.addChild(goBack, title, api_name, underline, div, logo, logoName);
    app.stage.addChild(container);

    return container;
};
