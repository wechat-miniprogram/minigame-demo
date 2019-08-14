import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let innerAudioContext,
        removeEventFn = () => {
            //取消监听音频播放进度更新事件
            innerAudioContext.offTimeUpdate();
            //取消监听音频自然播放至结束的事件
            innerAudioContext.offEnded();
        };
    return view(PIXI, app, obj, (status, fn) => {
        switch (status) {
            case 'createInnerAudioContext':
                innerAudioContext = wx.createInnerAudioContext();
                innerAudioContext.src =
                    'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46';
                innerAudioContext.onError(res => {
                    show.Modal(
                        {
                            10001: '系统错误',
                            10002: '网络错误',
                            10003: '文件错误',
                            10004: '格式错误',
                            '-1': '未知错误'
                        }[res.errCode]
                    );
                });
                break;
            case 'play':
                //开始播放
                innerAudioContext.play();
                //监听音频播放进度更新事件
                innerAudioContext.onTimeUpdate(function() {
                    fn('upDate', innerAudioContext.duration, innerAudioContext.currentTime);
                });
                //监听音频自然播放至结束的事件
                innerAudioContext.onEnded(function() {
                    fn('ended', innerAudioContext.duration);
                    removeEventFn();
                });

                fn('play'); // ui切换
                break;
            case 'pause':
                //停止播放
                innerAudioContext.pause();
                removeEventFn();

                fn('pause'); // ui切换
                break;
            case 'stop':
                //终止播放
                innerAudioContext.stop();
                removeEventFn();
                break;
        }
    });
};
