import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'onNetworkStatusChange':
                wx.onNetworkStatusChange(res => {
                    console.log(res);
                    drawFn(res); //更新UI
                });
                show.Modal('请去切换网络状态进行测试', '监听成功');
                break;
        }
    });
};
