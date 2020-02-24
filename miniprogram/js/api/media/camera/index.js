import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let camera;
    return view(PIXI, app, obj, res => {
        let { status, data, offsetY, drawFn } = res;
        switch (status) {
            case 'createCamera':
                // 创建相机
                camera = wx.createCamera({
                    x: data.x,
                    y: data.y,
                    width: data.width,
                    height: data.height
                });
                break;

            case 'longitudinalShift':
                camera.y = offsetY;
                break;

            case 'devicePosition':
                // 改变摄像头朝向
                camera.devicePosition = camera.devicePosition === 'back' ? 'front' : 'back';
                break;

            case 'takePhoto':
                // 进行拍照：拍照质量，值为 high, normal, low
                wx.showLoading({ title: '输出中...', mask: true });
                camera
                    .takePhoto()
                    .then(res => {
                        wx.hideLoading();

                        if (!res.tempImagePath) return show.Modal('相机还没有完全启动', '输出失败');

                        drawFn(res); // 绘制UI

                        show.Modal('确定后向上滑动进行预览', '输出成功');
                    })
                    .catch(() => {
                        wx.hideLoading();
                        show.Toast('输出失败');
                    });
                break;

            case 'startRecord':
                // 开始录像
                camera.startRecord();
                break;

            case 'stopRecord':
                // 结束录像，成功则返回封面与视频
                wx.showLoading({ title: '输出中...', mask: true });
                camera
                    .stopRecord()
                    .then(res => {
                        wx.hideLoading();

                        drawFn(res); // 绘制UI

                        show.Modal('确定后向上滑动进行预览', '输出成功');
                    })
                    .catch(res => {
                        wx.hideLoading();

                        if (res.errMsg === 'operateCamera:fail:is not recording') return show.Modal('你没有点击“开始录制按钮”', '输出失败');
                        if (res.errMsg === 'operateCamera:fail:stop error') return show.Modal('录制的时间过短', '输出失败');
                    });
                break;

            case 'destroy':
                camera.destroy();
                break;
        }
    });
};
