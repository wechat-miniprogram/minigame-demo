module.exports = function() {
    wx.showShareMenu({
        withShareTicket: true
    });
    // 监听被动调起分享
    wx.onShareAppMessage(function() {
        let query = window.router.getNowPageName() !== 'APIentry' && `pathName=${window.router.getNowPageName()}`;
        (window.query || {}).roomName && (query = query + `&roomName=${window.query.roomName}`);
        return {
            title: window.router.getNowPageLabel(),
            imageUrl: canvas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: canvas.width,
                height: (canvas.width * 4) / 5
            }),
            query
        };
    });
};
