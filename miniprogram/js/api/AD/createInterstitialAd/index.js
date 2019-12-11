import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let interstitialAd,
        codeObj = { 2001: '触发频率限制', 2002: '触发频率限制', 2003: '触发频率限制', 2004: '广告渲染失败', 2005: '广告调用异常' };
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'createInterstitialAd':
                // 初始化 init

                // 创建插屏广告组件;
                interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-4a474184cd6eb5cc' });

                // 监听插屏广告错误事件
                interstitialAd.onError(res => {
                    show.Modal(res.errMsg, '发生错误');
                });
                
                break;

            case 'show':
                // 显示 插屏广告
                interstitialAd.show().catch(res => {
                    show.Modal(res.errMsg, codeObj[res.errCode]);
                });

                break;

            case 'destroy':
                if (!interstitialAd) return;

                if (interstitialAd.destroy) {
                    // 销毁 插屏广告
                    interstitialAd.destroy();
                    interstitialAd = null;
                } else drawFn();

                break;
        }
    });
};
