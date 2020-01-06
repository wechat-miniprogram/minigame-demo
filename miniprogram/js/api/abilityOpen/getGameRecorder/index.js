import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    // 获取全局唯一的游戏画面录制对象
    let gameRecorder = wx.getGameRecorder(),
        gameRecorderShareButton,
        writeTime;
    return view(PIXI, app, obj, data => {
        let { status, drawFn, style } = data;
        switch (status) {
            case 'start':
                // 开始录屏
                wx.showLoading({ title: '正在启动录屏' });
                gameRecorder.start().then(res => {
                    wx.hideLoading();
                    res.error.code && show.Modal(res.errMsg, '发生错误');
                    if (!res.error.code) {
                        gameRecorder.on('timeUpdate', res => {
                            console.log(`视频时长: ${res.currentTime}`);
                            writeTime = Math.min(res.currentTime, 60000);
                        });
                    }

                    drawFn(!res.error.code); // 更新ui
                    console.log(res);
                });
                break;
            case 'pause':
                // 暂停录屏
                wx.showLoading({ title: '正在暂停录屏' });
                gameRecorder.pause().then(res => {
                    wx.hideLoading();
                    res.error.code && show.Modal(res.errMsg, '发生错误');
                    drawFn(!res.error.code); // 更新ui
                    console.log(res);
                });
                break;
            case 'resume':
                // 继续录屏
                wx.showLoading({ title: '开启继续录屏' });
                gameRecorder.resume().then(res => {
                    wx.hideLoading();
                    res.error.code && show.Modal(res.errMsg, '发生错误');
                    drawFn(!res.error.code); // 更新ui
                    console.log(res);
                });
                break;
            case 'abort':
                // 放弃录制
                wx.showLoading({ title: '正在放弃录制' });
                gameRecorder.abort().then(res => {
                    wx.hideLoading();
                    res.error.code && show.Modal(res.errMsg, '发生错误');
                    !res.error.code && gameRecorder.off('stop');
                    drawFn(!res.error.code); // 更新ui
                    console.log(res);
                });
                break;
            case 'stop':
                if (writeTime < 2000) {
                    show.Toast('录屏时间尽量大于2秒');
                    drawFn(); // 更新ui
                    return;
                }
                // 结束录屏
                wx.showLoading({ title: '正在结束录屏' });
                gameRecorder.stop().then(res => {
                    wx.hideLoading();
                    res.error.code && show.Modal(res.errMsg, '发生错误');
                    if (!res.error.code) {
                        gameRecorder.off('timeUpdate');
                        // 设置分享录制视频按钮
                        gameRecorderShareButton = wx.createGameRecorderShareButton({
                            style: {
                                ...style,
                                backgroundColor: '#ffffff',
                                color: '#576b95',
                                iconMarginRight: -34,
                                paddingRight: 0,
                                paddingLeft: 0
                            },
                            icon: 'test',
                            text: '分享',
                            share: {
                                query: 'test=test',
                                bgm: 'js/api/abilityOpen/getGameRecorder/bgm.mp3',
                                timeRange: [[0, writeTime]]
                            }
                        });

                        gameRecorderShareButton.show();
                        gameRecorderShareButton.onTap(res => {
                            console.log(res);
                        });
                    }
                    drawFn(!res.error.code); // 更新ui
                    console.log(res);
                });
                break;
            case 'hide':
                // 隐藏分享按钮
                gameRecorderShareButton && gameRecorderShareButton.hide();
                break;
            case 'show':
                // 显示分享按钮
                gameRecorderShareButton && gameRecorderShareButton.show();
                break;
        }
    });
};
