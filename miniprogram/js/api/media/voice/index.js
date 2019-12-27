import view from './view';
module.exports = function(PIXI, app, obj) {
    let recorderManager, innerAudioContext;
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'record':
                // 先获取全局唯一的录音管理器 RecorderManager
                !recorderManager && (recorderManager = wx.getRecorderManager());

                // 监听录音开始事件
                recorderManager.onStart(() => {
                    drawFn(); // 更新UI
                });

                // 开始录音
                recorderManager.start({ duration: 600000 }); // 录音的时长，单位 ms，最大值 600000（10 分钟）

                drawFn('hide'); // 更新UI

                break;
            case 'stopRecord':
                if (!recorderManager) return;

                // 监听录音结束事件
                recorderManager.onStop(res => {
                    if (!drawFn) return;

                    // 创建内部 audio 上下文 InnerAudioContext 对象。
                    innerAudioContext = wx.createInnerAudioContext();
                    innerAudioContext.src = res.tempFilePath;
                    drawFn(res.duration); // 更新UI
                });

                // 停止录音
                recorderManager.stop();

                drawFn && drawFn('hide'); // 更新UI

                break;

            case 'playVoice':
                // 开始播放
                innerAudioContext.play();

                // 监听音频自然播放至结束的事件
                innerAudioContext.onEnded(() => {
                    drawFn('ended', innerAudioContext.duration); // 更新UI
                });

                // 监听音频暂停事件
                innerAudioContext.onPause(() => {
                    let rebooting;
                    new Promise(resolve => {
                        rebooting = () => {
                            drawFn('stop'); // 更新UI
                            resolve();
                        };
                        // 监听音频中断结束事件
                        wx.onAudioInterruptionEnd(rebooting);
                        // 兼容安卓 Android 系统不兼容情况
                        wx.onShow(rebooting);
                    }).then(() => {
                        wx.offShow(rebooting);
                        wx.offAudioInterruptionEnd(rebooting);
                    });
                });

                drawFn('play'); // 更新UI

                break;

            case 'stopVoic':
                // 终止播放
                innerAudioContext.stop();
                innerAudioContext.offEnded();
                innerAudioContext.offPause();
                drawFn && drawFn(); // 更新UI

                break;

            case 'trash':
                if (!innerAudioContext) return;

                // 销毁当前实例
                innerAudioContext.destroy();
                innerAudioContext = null;

                wx.offAudioInterruptionEnd();

                drawFn && drawFn(); // 更新UI

                break;
        }
    });
};
