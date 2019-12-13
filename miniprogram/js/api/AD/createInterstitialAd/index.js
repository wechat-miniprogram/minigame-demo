import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let interstitialAd,
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
            case 'createInterstitialAd':
                // 初始化 init

                // 创建插屏广告组件;
                interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-4a474184cd6eb5cc' });

                // 监听插屏广告错误事件
                interstitialAd.onError(res => {
                    show.Modal(res.errMsg, codeObj[res.errCode]);
                });

                break;

            case 'show':
                // 显示 插屏广告
                interstitialAd.show().catch(res => {
                    show.Modal(res.errMsg, codeObj[res.errCode]);

                    // 失败后重新加载广告
                    interstitialAd.load().catch(res => {
                        show.Modal(res.errMsg, codeObj[res.errCode]);
                    });
                });

                break;

            case 'destroy':
                if (!interstitialAd) return;

                if (interstitialAd.destroy) {
                    // 销毁 插屏广告
                    interstitialAd.destroy();
                    interstitialAd = null;
                } else drawFn(); // 更新UI

                break;
        }
    });
};
