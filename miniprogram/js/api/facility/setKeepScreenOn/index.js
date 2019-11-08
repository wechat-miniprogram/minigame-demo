import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, keepScreenOn, drawFn } = data;
        switch (status) {
            case 'setKeepScreenOn':
                // 设置保持常亮状态。
                wx.setKeepScreenOn({
                    keepScreenOn,
                    success(res) {
                        console.log(res);

                        show.Toast(`常亮${keepScreenOn ? '已开启' : '已关闭'}`, 'success', 800);

                        drawFn(res); //绘制UI
                    }
                });
                break;
        }
    });
};
