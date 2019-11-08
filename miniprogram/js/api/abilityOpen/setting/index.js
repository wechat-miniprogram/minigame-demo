import view from './view';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'getSetting':
                //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
                wx.getSetting({
                    success(res) {
                        console.log(res.authSetting);
                        drawFn(res.authSetting); //绘制UI
                    }
                });
                break;
            case 'openSetting':
                //调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限。
                wx.openSetting({
                    success(res) {
                        console.log(res.authSetting);
                        drawFn(res.authSetting); //绘制UI
                    }
                });
                break;
        }
    });
};
