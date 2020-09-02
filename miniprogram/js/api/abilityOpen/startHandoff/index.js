import view from './view';
module.exports = function (PIXI, app, obj) {
    return view(PIXI, app, obj, (res) => {
        let { status } = res;
        switch (status) {
            case 'startHandoff':
                wx.startHandoff({
                    path: 'just a test',
                });
                break;
        }
    });
};
