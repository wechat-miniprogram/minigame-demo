import view from './view';
import show from '../../../libs/show';
import { subscribeWhatsNew, whatsNewSubscriptions } from '../../../errMsg/index';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, res => {
        let { status } = res;
        switch (status) {
            case 'requestSubscribeWhatsNew':
                // 调起订阅弹窗，返回用户订阅消息的操作结果
                wx.requestSubscribeWhatsNew({
                    msgType: 1, // 消息类型，1=游戏更新提醒，目前只有这种类型
                    success(res) {
                        show.Toast(`用户${res.confirm ? '已订阅' : '拒绝订阅'}`);
                    },
                    fail(err) {
                        show.Modal(subscribeWhatsNew[err.errCode], '提示');
                    }
                });
                break;

            case 'getWhatsNewSubscriptionsSetting':
                // 查询游戏更新订阅状态
                wx.getWhatsNewSubscriptionsSetting({
                    msgType: 1, // 消息类型，1=游戏更新提醒，目前只有这种类型
                    success(res) {
                        show.Modal(Object.assign(subscribeWhatsNew, whatsNewSubscriptions)[JSON.parse(res.respData.data).status], '提示');
                    },
                    fail(err) {
                        console.error(err);
                    }
                });
                break;
        }
    });
};
