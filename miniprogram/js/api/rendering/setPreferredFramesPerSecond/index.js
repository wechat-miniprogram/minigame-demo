import view from './view';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, res => {
        let { status,value } = res;
        switch (status) {
            case 'setPreferredFramesPerSecond':
                // 设置渲染帧率
                wx.setPreferredFramesPerSecond(value);

                break;
        }
    });
};
