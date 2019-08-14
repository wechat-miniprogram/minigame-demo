import view from './view';
module.exports = function(PIXI, app, obj) {
    let transpondFn;
    return view(PIXI, app, obj, date => {
        switch (date.status) {
            case 'onShareAppMessage': //被动调起分享的需要 调用 wx.onShareAppMessage API 进行监听
                wx.showShareMenu({
                    withShareTicket: true
                });
                wx.onShareAppMessage(
                    transpondFn ||
                        (transpondFn = function() {
                            return {
                                imageUrl:
                                    'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/list.png',
                                title: date.title
                            };
                        })
                );
                break;
            case 'offShareAppMessage': //调用 wx.offShareAppMessage API 可取消监听
                wx.hideShareMenu();
                wx.offShareAppMessage(transpondFn);
                transpondFn = null;
                break;
            case 'shareAppMessage': //主动调起分享需要 调用 wx.shareAppMessage API
                wx.shareAppMessage({
                    imageUrl: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/list.png',
                    title: '您已经成功调起主动分享'
                });
                break;
        }
    });
};
