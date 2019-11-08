import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, res => {
        let { status, drawFn, Img } = res;
        switch (status) {
            case 'createImage':
                Img = wx.createImage();
                show.Modal(`已创建成功，确认后进行加载图片`, '创建成功', () => {
                    Img.src = 'images/weapp.jpg';
                    Img.onload = () => {
                        drawFn(Img);
                    };
                });
                break;
        }
    });
};
