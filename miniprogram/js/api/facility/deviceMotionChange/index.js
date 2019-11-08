import view from './view';
module.exports = function(PIXI, app, obj) {
    let monitorFunc;
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'onDeviceMotionChange':
                // 开启获取设备方向的变化
                wx.startDeviceMotionListening();

                if (monitorFunc) return;

                // 监听设备方向变化事件。
                wx.onDeviceMotionChange(
                    (monitorFunc = res => {
                        drawFn(res); //绘制UI
                    })
                );
                break;
            case 'offDeviceMotionChange':
                // 停止获取设备方向的变化
                wx.stopDeviceMotionListening();

                // 取消监听设备方向变化事件。
                if (monitorFunc && wx.offDeviceMotionChange) {
                    wx.offDeviceMotionChange(monitorFunc);
                    monitorFunc = null;
                }
                break;
        }
    });
};
