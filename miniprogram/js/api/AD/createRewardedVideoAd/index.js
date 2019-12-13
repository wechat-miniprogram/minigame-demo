import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let rewardedVideo,
        codeObj = {
            1000: '后端接口调用失败',
            1001: '参数错误',
            1002: '广告单元无效',
            1003: '内部错误',
            1004: '无合适的广告',
            1005: '广告组件审核中',
            1006: '广告组件被驳回',
            1007: '广告组件被封禁',
            1008: '广告单元已关闭'
        };

    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'createRewardedVideoAd':
                // 初始化 init
                wx.showLoading({ title: '正在初始化...', mask: true });

                // 创建激励视频广告组件;
                rewardedVideo = wx.createRewardedVideoAd({
                    adUnitId: Math.round(Math.random())
                        ? 'adunit-367ee566b15d46b3' // 长视频
                        : 'adunit-52baa2f38c69b5f7', // 短视频
                    multiton: true
                });

                // 监听激励视频错误事件
                rewardedVideo.onError(res => {
                    show.Modal(res.errMsg, codeObj[res.errCode]);
                });

                // 加载激励视频广告
                rewardedVideo
                    .load()
                    .then(wx.hideLoading)
                    .catch(wx.hideLoading);

                break;

            case 'show':
                // 显示 激励视频广告
                rewardedVideo
                    .show()
                    .then(() => {
                        // 监听用户点击 关闭广告 按钮的事件
                        rewardedVideo.onClose(res => {
                            res.isEnded ? show.Modal('已获得奖励', '演示结果') : show.Modal('视频还没看完获取奖励失败', '演示结果');

                            // 取消监听用户点击 关闭广告 按钮的事件
                            rewardedVideo.offClose();

                            drawFn(); // 更新UI
                        });
                    })
                    .catch(res => {
                        show.Modal(res.errMsg, codeObj[res.errCode]);

                        // 失败后重新加载广告
                        rewardedVideo
                            .load()
                            .then(drawFn) // 更新UI
                            .catch(res => {
                                show.Modal(res.errMsg, codeObj[res.errCode]);
                                drawFn(); // 更新UI
                            });
                    });

                break;

            case 'destroy':
                if (!rewardedVideo) return;

                if (rewardedVideo.destroy) {
                    // 销毁 激励视频广告
                    rewardedVideo.destroy();
                    rewardedVideo = null;
                } else drawFn(); // 更新UI

                break;
        }
    });
};
