import view from './view';
import show from '../../../libs/show';
module.exports = function (PIXI, app, obj) {
    return view(PIXI, app, obj, (data) => {
        let { status, msg_type } = data;
        switch (status) {
            case 'send':
                wx.cloud.callFunction({
                    // 需调用的云函数名
                    name: 'programMessage',
                    // 传给云函数的参数
                    data: {
                        type: status,
                        msg_type, // 单发填"ONE",群发填“ALL”
                        page_path: `pathName=${window.router.getNowPageName()}`,
                    },
                    // 成功回调
                    success(res) {
                        show.Toast('发送成功', 'success', 1000);
                        console.log(res);
                    },
                    fail(res) {
                        show.Toast('发送成功', 'success', 1000);
                        console.log(res);
                    },
                });
                break;
        }
    });
};
