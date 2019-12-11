import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let rewardedVideo;
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'createRewardedVideoAd':
                // 初始化 init

                // 创建激励视频广告组件;
                rewardedVideo = wx.createRewardedVideoAd({
                    adUnitId: Math.round(Math.random())
                        ? 'adunit-367ee566b15d46b3' // 长视频
                        : 'adunit-52baa2f38c69b5f7', // 短视频
                    multiton: true
                });

                // 监听激励视频错误事件
                rewardedVideo.onError(res => {
                    show.Modal(res.errMsg, '发生错误');
                });
                
                break;

            case 'show':
                // 加载 激励视频广告
                rewardedVideo
                    .load()
                    .then(() => {
                        // 显示 激励视频广告
                        rewardedVideo.show();

                        // 监听用户点击 关闭广告 按钮的事件
                        rewardedVideo.onClose(res => {
                            res.isEnded ? show.Modal('已获得奖励', '演示结果') : show.Modal('视频还没看完获取奖励失败', '演示结果');

                            // 取消监听用户点击 关闭广告 按钮的事件
                            rewardedVideo.offClose();
                        });
                    })
                    .catch(() => {
                        show.Modal('激励视频 广告显示失败', '发生错误');
                    });

                break;

            case 'destroy':
                if (!rewardedVideo) return;

                if (rewardedVideo.destroy) {
                    // 销毁 激励视频广告
                    rewardedVideo.destroy();
                    rewardedVideo = null;
                } else drawFn();

                break;
        }
    });
};
