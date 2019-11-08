import view from './view';
module.exports = function(PIXI, app, obj) {
    let monitorFunc;
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'onGyroscopeChange':
                // 开启获取陀螺仪数据
                wx.startGyroscope();

                if (monitorFunc) return;

                // 监听陀螺仪数据变化事件。
                wx.onGyroscopeChange(
                    (monitorFunc = res => {
                        drawFn(res); //绘制UI
                    })
                );
                break;
            case 'offGyroscopeChange':
                // 停止获取陀螺仪数据
                wx.stopGyroscope();

                // 取消监听陀螺仪数据变化事件。
                if (monitorFunc && wx.offGyroscopeChange) {
                    wx.offGyroscopeChange(monitorFunc);
                    monitorFunc = null;
                }
                break;
        }
    });
};
