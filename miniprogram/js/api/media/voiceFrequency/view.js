import { p_text, p_img, p_box, p_circle } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '音频',
            api_name: 'Audio'
        }),
        box = p_box(PIXI, {
            height: 369 * PIXI.ratio,
            y: underline.y + underline.height + 92 * PIXI.ratio
        }),
        timerText = p_text(PIXI, {
            content: '00 : 00 : 00',
            fontSize: 60 * PIXI.ratio,
            y: 81 * PIXI.ratio,
            relative_middle: { containerWidth: box.width }
        }),
        progressBar = {
            gray: p_box(PIXI, {
                width: box.width - 170 * PIXI.ratio,
                height: 4 * PIXI.ratio,
                background: { color: 0xb5b6b5 },
                radius: 2,
                y: timerText.y + timerText.height + 80 * PIXI.ratio
            })
        },
        startingTime = p_text(PIXI, {
            content: '00 : 00',
            fontSize: 30 * PIXI.ratio,
            y: progressBar.gray.y + progressBar.gray.height + 56 * PIXI.ratio,
            relative_middle: { point: 117 * PIXI.ratio }
        }),
        finishTime = p_text(PIXI, {
            content: '01 : 00',
            fontSize: 30 * PIXI.ratio,
            y: startingTime.y,
            relative_middle: { point: box.width - 117 * PIXI.ratio }
        }),
        hint = p_text(PIXI, {
            content: '注意：离开当前页面后音乐将保持播放，但退出小游戏\n将停止',
            fontSize: 28 * PIXI.ratio,
            lineHeight: 40 * PIXI.ratio,
            fill: 0x9f9f9f,
            align: 'center',
            y: box.y + box.height + 18 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        playButton = p_img(PIXI, {
            width: 150 * PIXI.ratio,
            src: 'images/play.png',
            x: 300 * PIXI.ratio,
            y: box.y + box.height + 204 * PIXI.ratio
        }),
        stopButton = p_img(PIXI, {
            width: 150 * PIXI.ratio,
            src: 'images/stop.png',
            x: 42 * PIXI.ratio,
            y: playButton.y
        }),
        pauseButton = p_img(PIXI, {
            width: 150 * PIXI.ratio,
            src: 'images/pause.png',
            x: playButton.x,
            y: playButton.y
        });

    progressBar.green = p_box(PIXI, {
        width: progressBar.gray.width,
        height: progressBar.gray.height,
        background: { color: 0x09bb07 },
        radius: 2,
        y: progressBar.gray.y
    });
    progressBar.green.width = 0;

    progressBar.circle = p_circle(PIXI, {
        radius: 20 * PIXI.ratio,
        background: { color: 0x09bb07 },
        x: progressBar.gray.x,
        y: progressBar.gray.y + progressBar.gray.height / 2
    });

    // 播放“按钮”开始
    let voiceBandEnded = false;
    playButton.onClickFn(() => {
        callBack('play', (status, duration, currentTime) => {
            switch (status) {
                case 'play':
                    if (voiceBandEnded) {
                        resetProgressBar();
                        voiceBandEnded = false;
                    }
                    switchButtonFn('hideFn', 'showFn');
                    break;
                case 'upDate':
                    timingOperation(currentTime);
                    progressBar.green.width = (progressBar.gray.width * (currentTime / duration)) | 0;
                    progressBar.circle.setPositionFn({
                        x: progressBar.green.x + progressBar.green.width
                    });
                    break;
                case 'ended':
                    switchButtonFn('showFn', 'hideFn');
                    timingOperation(duration);
                    voiceBandEnded = true;
                    break;
            }
        });
    });
    // 播放“按钮”结束

    // 暂停“按钮”开始
    pauseButton.onClickFn(() => {
        callBack('pause');
        switchButtonFn('showFn', 'hideFn');
    });
    pauseButton.hideFn();
    // 暂停“按钮”结束

    // 终止“按钮”开始
    stopButton.onClickFn(() => {
        callBack('stop');
        switchButtonFn('showFn', 'hideFn');
        resetProgressBar();
    });
    stopButton.hideFn();
    // 终止“按钮”结束

    function switchButtonFn(...funcNames) {
        playButton[funcNames[0]]();
        pauseButton[funcNames[1]]();
        stopButton[funcNames[1]]();
    }

    function resetProgressBar() {
        timerText.turnText('00 : 00 : 00');
        progressBar.green.width = 0;
        progressBar.circle.setPositionFn({
            x: progressBar.green.x
        });
    }

    // 更新播放时间function 开始
    function timingOperation(currentTime) {
        let second = currentTime % 60 | 0,
            minute = (currentTime / 60) | 0;

        timerText.turnText(`00 : ${minute / 60 < 10 ? '0' + minute : minute} : ${second % 60 < 10 ? '0' + second : second}`);
    }
    // 更新播放时间function 结束

    // 创建内部 audio 上下文 InnerAudioContext 对象 开始
    callBack('createInnerAudioContext');
    // 创建内部 audio 上下文 InnerAudioContext 对象 结束

    goBack.callBack = callBack.bind(null, { status: 'destroy' });

    window.router.getNowPage(page => {
        page.reload = function() {
            logo.turnImg({ src: 'images/logo.png' });
            playButton.turnImg({ src: 'images/play.png' });
            stopButton.turnImg({ src: 'images/stop.png' });
        };
    });

    box.addChild(timerText, progressBar.gray, progressBar.green, progressBar.circle, startingTime, finishTime);
    container.addChild(goBack, title, api_name, underline, box, hint, stopButton, playButton, pauseButton, logo, logoName);
    app.stage.addChild(container);

    return container;
};
