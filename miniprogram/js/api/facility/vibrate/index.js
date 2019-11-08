import view from './view';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, res => {
        let { status } = res;
        switch (status) {
            case 'vibrateLong':
                // 使手机发生较长时间的振动（400 ms)
                wx.vibrateLong();
                break;
            case 'vibrateShort':
                // 使手机发生较短时间的振动（15 ms）
                wx.vibrateShort();
                break;
        }
    });
};
