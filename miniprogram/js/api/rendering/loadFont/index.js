import view from './view';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, res => {
        let { status, drawFn, font } = res;
        switch (status) {
            case 'loadFont':
                // 加载自定义字体文件
                font = wx.loadFont(`TencentSans-W7.subset.ttf`);
                drawFn(font); // 更新UI

                break;
        }
    });
};
