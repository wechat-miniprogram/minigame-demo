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
                recorderManager.start();

                drawFn('hide'); // 更新UI

                break;
            case 'stopRecord':
                // 监听录音结束事件
                recorderManager &&
                    recorderManager.onStop(res => {
                        // 创建内部 audio 上下文 InnerAudioContext 对象。
                        innerAudioContext = wx.createInnerAudioContext();
                        innerAudioContext.src = res.tempFilePath;

                        drawFn && drawFn(); // 更新UI
                    });

                // 停止录音
                recorderManager && recorderManager.stop();

                drawFn && drawFn('hide'); // 更新UI

                break;

            case 'playVoice':
                // 开始播放
                innerAudioContext.play();

                // 监听音频自然播放至结束的事件
                innerAudioContext.onEnded(function() {
                    innerAudioContext.offEnded();

                    drawFn('ended'); // 更新UI
                });

                drawFn('play'); // 更新UI

                break;

            case 'stopVoic':
                // 终止播放
                innerAudioContext.stop();
                innerAudioContext.offEnded();

                drawFn(); // 更新UI

                break;

            case 'trash':
                // 销毁当前实例
                innerAudioContext && innerAudioContext.destroy();
                innerAudioContext = null;

                drawFn && drawFn(); // 更新UI

                break;
        }
    });
};
