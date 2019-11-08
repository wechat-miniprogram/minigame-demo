import view from './view';
module.exports = function(PIXI, app, obj) {
    let transpondFn;
    return view(PIXI, app, obj, data => {
        let { status } = data;
        switch (status) {
            case 'onShareAppMessage':
                // 显示当前页面的转发按钮
                wx.showShareMenu({
                    withShareTicket: true
                });

                // 监听被动调起分享
                wx.onShareAppMessage(
                    transpondFn ||
                        (transpondFn = function() {
                            return {
                                title: '自定义转发标题',
                                desc: '自定义转发描述',
                                imageUrl: canvas.toTempFilePathSync({
                                    x: 0,
                                    y: 0,
                                    width: canvas.width,
                                    height: (canvas.width * 4) / 5
                                }),
                                query: `pathName=${window.router.getNowPageName()}`
                            };
                        })
                );
                break;
            case 'offShareAppMessage':
                // 隐藏转发按钮
                wx.hideShareMenu();

                // 取消监听被动调起分享
                wx.offShareAppMessage(transpondFn);
                transpondFn = null;
                break;
        }
    });
};
