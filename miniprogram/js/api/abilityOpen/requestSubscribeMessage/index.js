import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, res => {
        let { status } = res;
        switch (status) {
            case 'requestSubscribeMessage':
                wx.requestSubscribeMessage({
                    tmplIds: ['wAniOv_NUi6TXiQWX74_1LD5E4_6EfqvaeSxUxhqllg'],
                    success(res) {
                        if (res['wAniOv_NUi6TXiQWX74_1LD5E4_6EfqvaeSxUxhqllg'] === 'accept')
                            // 调用云函数进行推送消息
                            return wx.cloud.callFunction({
                                // 云函数名称
                                name: 'pushMessage',
                                // 传给云函数的参数
                                data: {
                                    page: `pathName=${window.router.getNowPageName()}`
                                },
                                success() {
                                    show.Toast('推送成功', 'success', 1000);
                                },
                                fail: console.error
                            });

                        if (res['wAniOv_NUi6TXiQWX74_1LD5E4_6EfqvaeSxUxhqllg'] === 'reject') return show.Modal('用户主动拒绝', '订阅失败');
                    }
                });
                break;
        }
    });
};
