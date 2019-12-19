import view from './view';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'login':
                // 微信登录
                wx.login({
                    success(res) {
                        if (res.code) {
                            // 发起网络请求
                            drawFn();
                        } else {
                            console.log('登录失败！' + res.errMsg);
                        }
                    }
                });
                break;
        }
    });
};
