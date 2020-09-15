import view from './view';
import * as show from '../../../libs/show';
module.exports = function (PIXI, app, obj) {
    let gridAd;
    return view(PIXI, app, obj, (data) => {
        let { status, style, drawFn } = data;
        switch (status) {
            case 'createGridAd':
                // 创建 Grid 广告组件;
                gridAd = wx.createGridAd({
                    adUnitId: 'adunit-ac7c87d9ad6b2b2b',
                    adIntervals: 30, // 广告自动刷新的间隔时间，单位为秒，参数值必须大于等于30（该参数不传入时 Grid 广告不会自动刷新）
                    adTheme: 'white',
                    gridCount: 5,
                    style: {
                        left: style.left,
                        top: style.top,
                        width: style.width,
                        opacity: 0.8,
                    },
                });

                wx.showLoading({ title: '广告打开中...', mask: true });

                // 监听 Grid 广告加载事件。
                gridAd.onLoad(() => {
                    wx.hideLoading();

                    // 需要主动调用show函数 Grid 广告才会显示
                    gridAd.show();

                    drawFn(); // 更新UI
                });

                // 监听 Grid 广告错误事件。
                gridAd.onError((res) => {
                    wx.hideLoading();

                    show.Modal(res.errMsg, '发生错误');

                    drawFn(res); // 更新UI
                });

                break;

            case 'hide':
                // 隐藏 Grid 广告
                gridAd.hide();

                drawFn(); // 更新UI

                break;

            case 'show':
                // 显示 Grid 广告
                gridAd.show();

                drawFn(); // 更新UI

                break;

            case 'destroy':
                if (!gridAd) return;

                gridAd.hide();

                // 销毁 Grid 广告
                gridAd.destroy();
                gridAd = null;

                drawFn && drawFn(); // 更新UI

                break;
        }
    });
};
