import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'UnionID':
                wx.showLoading({ title: '响应中...', mask: true });
                // 这里我们调用云函数来获取UnionID
                wx.cloud.callFunction({
                    // 需调用的云函数名
                    name: 'getUnionID',
                    success(res) {
                        wx.hideLoading();
                        drawFn(res.result.unionid) //更新 UI
                        console.log(res.result.unionid);
                    },
                    fail(res) {
                        wx.hideLoading();

                        show.Modal(`${res.errCode}`, '失败');

                        console.log(`调起失败: ${res.errCode}`);
                    }
                });
                break;
        }
    });
};
