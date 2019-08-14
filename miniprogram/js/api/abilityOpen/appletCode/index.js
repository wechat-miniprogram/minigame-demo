import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, drawFn => {
        wx.showLoading({ title: '生成中...', mask: true });
        wx.cloud.callFunction({
            // 需调用的云函数名
            name: 'getAppletCode',
            // 成功回调
            success(res) {
                wx.hideLoading();

                show.Toast('生成成功', 'success', 1000);

                console.log(res);

                drawFn(res.result.base64); //绘制二维码
            },
            fail(res) {
                wx.hideLoading();

                show.Toast('生成失败', 'success', 1000);

                console.log(res.errCode);
            }
        });
    });
};
