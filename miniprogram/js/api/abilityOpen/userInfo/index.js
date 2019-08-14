import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let userInfoButton = null;
    return view(PIXI, app, obj, data => {
        switch (data.status) {
            case 'createUserInfoButton':
                //这里先检查一下是否授权 毕竟用户是否有授权会影响调用wx.createUserInfoButton()后返回的对象在触发tap时 是否有授权弹窗
                wx.getSetting({
                    complete(res) {
                        //调用wx.createUserInfoButton()返回一个对象
                        userInfoButton = wx.createUserInfoButton({
                            type: 'text',
                            text: res.authSetting['scope.userInfo'] ? '点击获取用户信息' : '授权并获取用户信息',
                            style: {
                                left: 15,
                                top: data.top,
                                width: data.width,
                                height: 40,
                                lineHeight: 40,
                                backgroundColor: '#ff0000',
                                color: '#ffffff',
                                textAlign: 'center',
                                fontSize: 16,
                                borderRadius: 4
                            }
                        });
                        userInfoButton.onTap(res => {
                            if (res.errMsg === 'getUserInfo:fail auth deny')
                                return show.Modal('用户不授权是无法获取到用户信息的', '授权失败');

                            show.Toast('获取成功', 'success', 1000);

                            console.log(res);
                            
                            data.drawFn(res); //绘制UI
                        });

                        data.goBackInteractiveFn() //允许点击返回按钮
                    }
                });
                break;
            case 'getUserInfo':
                wx.getUserInfo({
                    success(res) {
                        show.Toast('获取成功', 'success', 1000);
                        console.log(res);
                        data.drawFn(res); //绘制UI
                    },
                    fail() {
                        show.Modal('在用户没有授权的情况下调用wx.getUserInfo是无法获取用户信息的', '获取失败');
                    }
                });
                break;
            case 'destroyUserInfoButton':
                //销毁对象
                userInfoButton && userInfoButton.destroy();
                break;
        }
    });
};
