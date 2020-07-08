import view from './view';
module.exports = function (PIXI, app, obj) {
    return view(PIXI, app, obj, (data) => {
        let { status } = data;
        switch (status) {
            case 'shareTimeLine':
                //主动转发到朋友圈。
                wx.shareTimeLine({
                    imageUrl: canvas.toTempFilePathSync({
                        x: 0,
                        y: 0,
                        width: canvas.width,
                        height: (canvas.width * 4) / 5,
                    }),
                    query: `pathName=${window.router.getNowPageName()}`,
                });
                break;
        }
    });
};
