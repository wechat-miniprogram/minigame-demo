import view from './view';
import { getSignature, delNowPageFn } from './functionPool';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, drawFn, groupId, re_enter, muteMicrophone, muteEarphone, drawRoomNumFn, listeningFn } = data;
        switch (status) {
            // 加入 (创建) 实时语音通话
            case 'joinVoIPChat':
                // 判断groupId是否存在，不存在就创建房间否则进入房间
                if (!groupId) {
                    wx.showLoading({ title: '正在创建房间' });

                    groupId = `语音房间${Math.random()
                        .toString(36)
                        .substr(2)}`;

                    // 先获取有效 签名signature
                    getSignature(groupId, res => {
                        wx.joinVoIPChat({
                            ...res,
                            complete(res) {
                                wx.hideLoading();
                                console.log(res);
                                if (res.errCode) window.router.delPage();
                                else {
                                    drawFn(res, groupId); // 更新UI
                                    listeningFn();
                                }
                            }
                        });
                    });
                } else {
                    wx.showLoading({ title: re_enter || '正在进入房间', mask: true });

                    // 先获取有效 签名signature
                    getSignature(groupId, res => {
                        wx.joinVoIPChat({
                            ...res,
                            complete(res) {
                                wx.hideLoading();
                                console.log(res);
                                if (res.errCode) window.router.delPage();
                                else {
                                    drawFn(res, groupId); // 更新UI
                                    listeningFn();
                                }
                            }
                        });
                    });
                }

                listeningFn = function() {
                    //监听房间人数变化
                    wx.onVoIPChatMembersChanged(res => {
                        drawRoomNumFn(res.openIdList.length);
                    });
                    //监听被动断开实时语音通话事件。包括小游戏切入后端时断开
                    wx.onVoIPChatInterrupted(delNowPageFn);

                    window.query = {
                        pathName: window.router.getNowPageName(),
                        roomName: groupId,
                        re_enter: '返到当前房间'
                    };
                };

                break;
            case 'shareAppMessage':
                wx.shareAppMessage({
                    title: `快来加入我发起的语言对话房间`,
                    imageUrl: canvas.toTempFilePathSync({
                        x: 0,
                        y: 0,
                        width: canvas.width,
                        height: (canvas.width * 4) / 5
                    }),
                    query: `pathName=${window.router.getNowPageName()}&roomName=${groupId}`
                });
                break;
            case 'exitVoIPChat':
                //退出（销毁）实时语音通话
                wx.showToast({ title: '你已退出房间' });

                wx.exitVoIPChat();

                window.query = null;
                break;
            case 'updateVoIPChatMuteConfig':
                //更新实时语音设置
                if (typeof muteMicrophone !== 'undefined') muteMicrophone = { muteMicrophone };
                if (typeof muteEarphone !== 'undefined') muteEarphone = { muteEarphone };

                wx.updateVoIPChatMuteConfig({
                    muteConfig: { ...muteMicrophone, ...muteEarphone },
                    success() {
                        drawFn(); //绘制UI
                    }
                });
                break;
        }
    });
};
