import { p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '关系链互动',
            api_name: 'relationalChaininteractiveData'
        }),
        tipText = p_text(PIXI, {
            content: '提示：在赠送/索要/邀请场景可搭配好友列表、\n排行榜使用，跟同玩好友间进行互动',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: underline.height + underline.y + 720 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        });

    goBack.callBack = () => {
        callBack({ status: 'close' });
    };

    // 默认上报分数
    wx.setUserCloudStorage({
        KVDataList: [
            {
                key: 'score',
                value: JSON.stringify({
                    wxgame: {
                        score: 0,
                        update_time: (Date.now() / 1000) | 0
                    }
                })
            }
        ]
    });

    callBack({ status: 'relationalChaininteractiveData' });

    container.addChild(goBack, title, api_name, underline, tipText, logo, logoName);

    app.stage.addChild(container);

    return container;
};
