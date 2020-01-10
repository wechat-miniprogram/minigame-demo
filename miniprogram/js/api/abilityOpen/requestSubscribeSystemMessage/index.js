import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let msgType = {
        SYS_MSG_TYPE_INTERACTIVE: '好友互动',
        SYS_MSG_TYPE_RANK: '好友排行榜超越',
        accept: '接受订阅',
        reject: '拒绝订阅',
        ban: '被封禁'
    };
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'requestSubscribeSystemMessage':
                // 调起小游戏永久订阅消息界面
                wx.requestSubscribeSystemMessage({
                    msgTypeList: Object.keys(msgType).slice(0,2),
                    success(res) {
                        delete res.errMsg;
                        let msgObj = {};
                        Object.keys(res).forEach(item => {
                            msgObj[msgType[item]] = msgType[res[item]];
                        });
                        drawFn(msgObj); // 绘制UI
                    },
                    fail() {
                        show.Modal('你已拒绝消息订阅，可前往“右上角三个点-设置”中打开', '永久订阅失败');
                    }
                });
                break;
        }
    });
};
