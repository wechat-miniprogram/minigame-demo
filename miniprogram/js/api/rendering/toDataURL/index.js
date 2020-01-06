import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    const Image = wx.createImage(),
        offScreenCanvas = wx.createCanvas(),
        ctx = offScreenCanvas.getContext('2d');

    Image.src = 'images/weapp.jpg';
    Image.onload = () => {
        offScreenCanvas.width = Image.width;
        offScreenCanvas.height = Image.height;
        ctx.drawImage(Image, 0, 0);
    };

    return view(PIXI, app, obj, res => {
        let { status, drawFn, base64 } = res;
        switch (status) {
            case 'toDataURL':
                // 把画布内容转换为URL
                base64 = offScreenCanvas.toDataURL();
                show.Modal(base64, '转换成功');
                drawFn(base64);
                break;
        }
    });
};
