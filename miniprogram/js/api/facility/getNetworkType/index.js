import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'getNetworkType':
                wx.getNetworkType({
                    success(res) {
                        drawFn(res);//更新UI
                    },
                    fail() {
                        show.Toast('获取失败', 'success', 500);
                    }
                });
                break;
        }
    });
};
