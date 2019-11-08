import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let userInfoButton = null;
    return view(PIXI, app, obj, data => {
        switch (data.status) {
            case 'createUserInfoButton':
                //调用wx.createUserInfoButton(),返回一个“用户信息按钮”对象
                userInfoButton = wx.createUserInfoButton({
                    type: 'text',
                    text: '获取用户信息',
                    style: {
                        left: data.left,
                        top: data.top,
                        width: data.width,
                        height: 40,
                        lineHeight: 40,
                        backgroundColor: '#1aad19',
                        color: '#ffffff',
                        textAlign: 'center',
                        fontSize: 16,
                        borderRadius: 4
                    }
                });
                userInfoButton.onTap(res => {
                    if (res.errMsg === 'getUserInfo:fail auth deny')
                        return show.Modal('用户不授权是无法获取到用户信息的', '授权失败');

                    wx.getUserInfo({
                        success(res) {
                            show.Toast('获取成功', 'success', 1000);
                            data.drawFn(res.userInfo); //绘制UI
                            console.log(res);
                        }
                    });
                });

                break;
            case 'destroyUserInfoButton':
                //销毁对象
                userInfoButton && userInfoButton.destroy();
                break;
        }
    });
};
