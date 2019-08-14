module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = {
            button: new PIXI.Graphics(),
            arrow: new PIXI.Graphics()
        },
        title = new PIXI.Text('音频', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x999999
        }),
        line = new PIXI.Graphics(),
        box = new PIXI.Graphics(),
        timerText = new PIXI.Text('00 : 00 : 00', {
            fontSize: `${50 * PIXI.ratio}px`,
            fill: 0x333333
        }),
        startingTime = new PIXI.Text('00 : 00', {
            fontSize: `${26 * PIXI.ratio}px`,
            fill: 0x333333
        }),
        finishTime = new PIXI.Text('06 : 41', {
            fontSize: `${26 * PIXI.ratio}px`,
            fill: 0x333333
        }),
        progressBar = {
            gray: new PIXI.Graphics(),
            green: new PIXI.Graphics(),
            circle: new PIXI.Graphics()
        },
        hint = new PIXI.Text('注意：离开当前页面后背景音乐将保持播放，但退出\n小游戏将停止', {
            fontSize: `${28 * PIXI.ratio}px`,
            fill: 0x999999,
            align: 'center'
        }),
        stopButton = new PIXI.Graphics(),
        stop = new PIXI.Sprite(PIXI.loader.resources['images/stop.png'].texture),
        playButton = new PIXI.Graphics(),
        play = new PIXI.Sprite(PIXI.loader.resources['images/play.png'].texture),
        pause = new PIXI.Sprite(PIXI.loader.resources['images/pause.png'].texture);

    goBack.button.position.set(0, 52 * Math.ceil(PIXI.ratio));
    goBack.button
        .beginFill(0xffffff, 0)
        .drawRect(0, 0, 80 * PIXI.ratio, 80 * PIXI.ratio)
        .endFill();
    goBack.arrow
        .lineStyle(5 * PIXI.ratio, 0x333333)
        .moveTo(50 * PIXI.ratio, 20 * PIXI.ratio)
        .lineTo(30 * PIXI.ratio, 40 * PIXI.ratio)
        .lineTo(50 * PIXI.ratio, 60 * PIXI.ratio);

    title.position.set((obj.width - title.width) / 2, 180 * PIXI.ratio);

    line.beginFill(0x999999)
        .drawRect(0, 0, title.width, 1 * PIXI.ratio)
        .endFill();
    line.position.set((obj.width - title.width) / 2, title.y + title.height + 10 * PIXI.ratio);

    box.position.set(0, line.y + line.height + 100 * PIXI.ratio);
    box.beginFill(0xffffff)
        .drawRect(0, 0, obj.width, obj.width / 2)
        .endFill();
    timerText.position.set((box.width - timerText.width) / 2, box.height / 6);

    progressBar.gray
        .beginFill(0x999999)
        .drawRect(0, 0, (box.width * 9) / 11, 3 * PIXI.ratio)
        .endFill();
    progressBar.gray.position.set(box.width / 11, box.height / 1.4);
    progressBar.green
        .beginFill(0x07c160)
        .drawRect(0, 0, progressBar.gray.width, 3 * PIXI.ratio)
        .endFill();
    progressBar.green.position.set(progressBar.gray.x, progressBar.gray.y);
    progressBar.green.width = 0;
    progressBar.circle
        .lineStyle(2 * PIXI.ratio, 0xcccccc)
        .beginFill(0xffffff)
        .drawCircle(0, 0, box.width / 30)
        .endFill();
    progressBar.circle.position.set(progressBar.green.x, progressBar.green.y + progressBar.green.height / 2);

    startingTime.position.set(
        progressBar.gray.x - startingTime.width / 2,
        progressBar.gray.y + progressBar.circle.height / 1.5
    );
    finishTime.position.set(progressBar.gray.x + progressBar.gray.width - finishTime.width / 2, startingTime.y);

    hint.position.set((obj.width - hint.width) / 2, box.y + box.height * 1.05);

    stopButton.position.set(30 * PIXI.ratio + box.width / 10, box.y + box.height + 250 * PIXI.ratio);
    stopButton
        .beginFill(0xffffff)
        .drawCircle(0, 0, box.width / 10)
        .endFill();

    stop.width = stop.height = stopButton.width;
    stop.position.set(-stop.width / 2, -stop.width / 2);

    playButton.position.set(1.8 * stopButton.width + stopButton.x, stopButton.y);
    playButton
        .beginFill(0xffffff)
        .drawCircle(0, 0, box.width / 10)
        .endFill();
    play.width = play.height = stop.width;
    play.position.set(stop.x, stop.y);
    pause.width = pause.height = stop.width;
    pause.position.set(stop.x, stop.y);
    stopButton.visible = pause.visible = !play.visible;

    goBack.button.interactive = true;
    goBack.button.touchend = () => {
        window.router.goBack();
    };

    let voiceBandEnded = false;
    function noneStopButton() {
        stopButton.visible = pause.visible = play.visible;
        play.visible = !stopButton.visible;
    }
    function resetProgressBar() {
        timerText.text = '00 : 00 : 00';
        progressBar.green.width = 0;
        progressBar.circle.position.set(progressBar.green.x, progressBar.green.y + progressBar.green.height / 2);
    }
    function timingOperation(currentTime) {
        let second = currentTime % 60 | 0,
            minute = (currentTime / 60) | 0;
        timerText.text = `00 : ${minute / 60 < 10 ? '0' + minute : minute} : ${
            second % 60 < 10 ? '0' + second : second
        }`;
    }
    playButton.interactive = true;
    playButton.touchstart = () => {
        callBack(play.visible ? 'play' : 'pause', (status, duration, currentTime) => {
            switch (status) {
                case 'play':
                    if (voiceBandEnded) {
                        resetProgressBar();
                        voiceBandEnded = false;
                    }
                    play.visible = stopButton.visible;
                    stopButton.visible = pause.visible = !play.visible;
                    break;
                case 'pause':
                    noneStopButton();
                    break;
                case 'upDate':
                    timingOperation(currentTime);
                    progressBar.green.width = (progressBar.gray.width * (currentTime / duration)) | 0;
                    progressBar.circle.position.x = progressBar.green.x + progressBar.green.width;
                    break;
                case 'ended':
                    noneStopButton();
                    timingOperation(duration);
                    voiceBandEnded = true;
                    break;
            }
        });
    };
    stopButton.interactive = true;
    stopButton.touchstart = () => {
        callBack('stop');
        noneStopButton();
        resetProgressBar();
    };
    callBack('createInnerAudioContext');

    goBack.button.addChild(goBack.arrow);
    container.addChild(goBack.button, title, line);
    box.addChild(timerText, progressBar.gray, progressBar.green, progressBar.circle, startingTime, finishTime);
    container.addChild(box, hint);
    stopButton.addChild(stop);
    container.addChild(stopButton);
    playButton.addChild(play, pause);
    container.addChild(playButton);
    container.visible = false;
    app.stage.addChild(container);

    return container;
};
