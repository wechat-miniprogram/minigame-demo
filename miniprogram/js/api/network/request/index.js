import view from './view';
import { request } from '../apiList';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, func => {
        let time = Date.now();
        request(res => {
            wx.reportPerformance && wx.reportPerformance(1001, Date.now() - time); // 上报请求总时间的耗时

            func(res, time); //绘制信息
        });
    });
};
