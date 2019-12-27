import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let innerAudioContext,
        removeEventFn = () => {
            //取消监听音频播放进度更新事件
            innerAudioContext.offTimeUpdate();
            //取消监听音频自然播放至结束的事件
            innerAudioContext.offEnded();

            innerAudioContext.isInterruption = false;
        },
        interruptionFn = () => {
            // 阻止多次调用
            if (interruptionFn.isRun) return;
            interruptionFn.isRun = true;

            let rebooting;
            new Promise(resolve => {
                rebooting = resolve;

                // 监听音频中断结束事件
                wx.onAudioInterruptionEnd(rebooting);

                // 兼容安卓 Android 系统不兼容情况
                wx.onShow(rebooting);
            }).then(() => {
                interruptionFn.isRun = false;

                wx.offShow(rebooting);
                wx.offAudioInterruptionEnd(rebooting);

                if (innerAudioContext.isInterruption) {
                    // 播放音频
                    innerAudioContext.play();
                }
            });
        };

    return view(PIXI, app, obj, (status, drawFn) => {
        switch (status) {
            case 'createInnerAudioContext':
                // 创建内部 audio 上下文 InnerAudioContext 对象。
                innerAudioContext = wx.createInnerAudioContext();
                innerAudioContext.src = 'https://wxamusic.wx.qq.com/wxag/xingji/music/bg1.mp3';

                // 监听因加载音频来源所发生的错误
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

                // 监听音频暂停事件
                innerAudioContext.onPause(interruptionFn);

                break;

            case 'play':
                // 开始播放
                innerAudioContext.play();
                // 监听音频播放进度更新事件
                innerAudioContext.onTimeUpdate(() => {
                    drawFn('upDate', innerAudioContext.duration, innerAudioContext.currentTime); // 更新ui
                });
                // 监听音频自然播放至结束的事件
                innerAudioContext.onEnded(() => {
                    drawFn('ended', innerAudioContext.duration); // 更新ui
                    removeEventFn();
                });

                innerAudioContext.isInterruption = true;

                drawFn('play'); // 更新ui
                break;

            case 'pause':
                // 暂停播放
                innerAudioContext.pause();
                removeEventFn();

                break;

            case 'stop':
                // 终止播放
                innerAudioContext.stop();
                removeEventFn();
                break;
        }
    });
};
