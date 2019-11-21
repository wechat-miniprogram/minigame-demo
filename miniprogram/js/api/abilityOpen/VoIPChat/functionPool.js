import show from '../../../libs/show';
module.exports = (function() {
    function getSignature(groupId, callBack) {
        // 首先检查是否有授权record
        authorization(() => {
            // 这里我们调用云函数来获取signature
            wx.cloud.callFunction({
                // 需调用的云函数名
                name: 'getSignature',
                data: {
                    groupId
                },
                success(res) {
                    callBack(res.result);
                    console.log(res.result);
                },
                fail(res) {
                    wx.hideLoading();
                    show.Modal(`${res.errCode}`, '失败');
                    window.router.delPage();
                    console.log(`调起失败: ${res.errCode}`);
                }
            });
        });
    }
    let scopeRecord;
    function authorization(callBack) {
        if (scopeRecord) return callBack(); // 下一次调用时，有授权直接回调

        wx.getSetting({
            success(res) {
                scopeRecord = res.authSetting['scope.record'];

                if (scopeRecord) return callBack(); // 首次调用时，有授权直接回调

                // 调起api触发授权弹窗
                wx.authorize({
                    scope: 'scope.record',
                    success() {
                        scopeRecord = true;
                        callBack();
                    },
                    fail() {
                        wx.hideLoading();
                        scopeRecord = false;
                        show.Modal('没有授权是无法加入 (创建) 实时语音通话', '授权失败');
                        window.router.delPage();
                    }
                });
            }
        });
    }

    function delNowPageFn(res) {
        // 取消监听被动断开实时语音通话事件
        wx.offVoIPChatInterrupted(delNowPageFn);

        window.router.delPage();
        setTimeout(() => {
            let query = window.query;
            window.router.navigateTo(query.pathName, query);
        }, 0);
        console.log('onVoIPChatInterrupted：', res);
    }

    return {
        getSignature,
        delNowPageFn
    };
})();
