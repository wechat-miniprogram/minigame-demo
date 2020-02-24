import view from './view';
import { errMsgGlobal } from '../../../errMsg/index';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let video;
    return view(PIXI, app, obj, res => {
        let { status, data } = res;
        switch (status) {
            case 'createVideo':
                //调起视频控件
                video = wx.createVideo({
                    x: data.x,
                    y: data.y,
                    width: data.width,
                    height: data.height,
                    // 显示默认的视频控件
                    controls: true,
                    enablePlayGesture: true,
                    // 传入
                    src: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/video.mp4'
                });
                video.onError(res => {
                    for (var i = 0, errMsglist = Object.keys(errMsgGlobal); i < errMsglist.length; i++) {
                        if (res.errMsg.includes(errMsglist[i])) {
                            errMsgGlobal[errMsglist[i]]({
                                callback(res) {
                                    show.Modal(res, '发生错误');
                                }
                            });
                            break;
                        }
                    }
                });
                video.onEnded(() => {
                    show.Toast('播放结束', 'success', 1000);
                });
                video.onPause(() => {
                    show.Toast('暂停成功', 'success', 1000);
                });
                video.onPlay(() => {
                    show.Toast('播放成功', 'success', 1000);
                });
                video.onWaiting(() => {
                    show.Toast('视频缓冲中', 'success', 1000);
                });
                break;
            case 'destroy': //销毁当前视频控件
                video.destroy();
                break;
        }
    });
};
