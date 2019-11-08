import view from './view';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, value, drawFn } = data;
        switch (status) {
            case 'setScreenBrightness':
                //设置屏幕亮度
                wx.setScreenBrightness({ value });
                break;
            case 'getScreenBrightness':
                //获取屏幕亮度
                wx.getScreenBrightness({
                    success(res) {
                        console.log(res);
                        drawFn(res);
                    }
                });
                break;
        }
    });
};
