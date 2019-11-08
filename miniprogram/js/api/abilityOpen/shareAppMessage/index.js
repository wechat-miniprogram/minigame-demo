import view from './view';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status } = data;
        switch (status) {
            case 'shareAppMessage':
                //主动拉起转发，进入选择通讯录界面。
                wx.shareAppMessage({
                    imageUrl: canvas.toTempFilePathSync({
                        x: 0,
                        y: 0,
                        width: canvas.width,
                        height: (canvas.width * 4) / 5
                    }),
                    query: `pathName=${window.router.getNowPageName()}`
                });
                break;
        }
    });
};
