import view from './view';
import show from '../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, (status, rendering) => {
        let base64, fontFamily, Img;
        switch (status) {
            case 'toDataURL':
                base64 = canvas.toDataURL();
                show.Modal(base64, '转换成功');
                console.log(base64);
                break;
            case 'toTempFilePath':
                canvas.toTempFilePath({
                    x: 0,
                    y: 0,
                    width: canvas.width,
                    height: canvas.height,
                    success(res) {
                        show.Modal(res.tempFilePath, '保存成功！确认后转发', () => {
                            wx.shareAppMessage({
                                imageUrl: res.tempFilePath
                            });
                        });
                    }
                });
                break;
            case 'setPreferredFramesPerSecond':
                wx.setPreferredFramesPerSecond(rendering.fps);
                rendering();
                break;
            case 'loadFont':
                fontFamily = wx.loadFont('TheSenom-2.ttf');
                rendering(fontFamily);
                console.log(fontFamily);
                break;
            case 'createImage':
                Img = wx.createImage();
                show.Modal(`对象类型是：${Img}`, '已创建成功！确认后请选择图片进行加载', () => {
                    rendering((imageSrc, drawImgFn) => {
                        Img.src = imageSrc;
                        Img.onload = () => {
                            drawImgFn(Img);
                        };
                    });
                });
                break;
        }
    });
};
