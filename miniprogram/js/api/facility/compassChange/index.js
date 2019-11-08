import view from './view';
module.exports = function(PIXI, app, obj) {
    let monitorFunc;
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'onCompassChange':
                // 开启获取罗盘数据
                wx.startCompass({
                    interval: 'game'
                });

                if (monitorFunc) return;

                // 监听设备方向变化事件。
                wx.onCompassChange(
                    (monitorFunc = res => {
                        drawFn(res); //绘制UI
                    })
                );
                break;
            case 'offCompassChange':
                // 停止获取罗盘数据
                wx.stopCompass();

                // 取消监听设备方向变化事件。
                if (monitorFunc && wx.offCompassChange) {
                    wx.offCompassChange(monitorFunc);
                    monitorFunc = null;
                }
                break;
        }
    });
};
