module.exports = function () {
    wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline'],
    });

    const callBack = () => {
        let query = window.router.getNowPageName() !== 'APIentry' && `pathName=${window.router.getNowPageName()}`;
        (window.query || {}).roomName && (query = query + `&roomName=${window.query.roomName}`);
        return {
            title: window.router.getNowPageLabel(),
            imageUrl: canvas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: canvas.width,
                height: (canvas.width * 4) / 5,
            }),
            query,
        };
    };

    // 监听被动调起分享
    wx.onShareAppMessage(callBack);

    // 监听被动调起分享到朋友圈
    wx.onShareTimeline && wx.onShareTimeline(callBack);
};
