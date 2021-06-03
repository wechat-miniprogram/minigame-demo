import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'onDeviceOrientationChange':
                // 监听横竖屏切换事件
                wx.onDeviceOrientationChange(res => {
                    console.log(res);

                    show.Toast('触发成功', 'success', 800);

                    drawFn(); //绘制UI
                });
                break;
            case 'offDeviceOrientationChange':
                // 取消监听横竖屏切换事件
                wx.offDeviceOrientationChange();
                break;
        }
    });
};
