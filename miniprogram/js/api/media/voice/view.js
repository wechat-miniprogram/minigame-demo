import { p_circle, p_img, p_text } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '录音',
            api_name: 'RecorderManager、InnerAudioContext'
        }),
        totalTime = p_text(PIXI, {
            content: '00:00:00',
            fontSize: 60 * PIXI.ratio,
            y: underline.y + underline.height + 125 * PIXI.ratio,
            relative_middle: { point: obj.width / 2 }
        }),
        writeTime = p_text(PIXI, {
            content: '00:00:00',
            fontSize: 30 * PIXI.ratio,
            y: underline.y + underline.height + 229 * PIXI.ratio,
            relative_middle: { point: obj.width / 2 }
        }),
        recordButton = p_img(PIXI, {
            width: 150 * PIXI.ratio,
            y: underline.y + underline.height + 276 * PIXI.ratio,
            src: 'images/record.png',
            relative_middle: { containerWidth: obj.width }
        }),
        stopRecordButton = p_circle(PIXI, {
            radius: 55 * PIXI.ratio,
            border: { width: 20 * PIXI.ratio, color: 0xffffff },
            background: { color: 0xf55c23 },
            x: obj.width / 2,
            y: underline.y + underline.height + 351 * PIXI.ratio
        }),
        playVoiceButton = p_img(PIXI, {
            width: recordButton.width,
            y: underline.y + underline.height + 323 * PIXI.ratio,
            src: 'images/play.png',
            relative_middle: { containerWidth: obj.width }
        }),
        stopVoiceButton = p_img(PIXI, {
            width: recordButton.width,
            x: 113 * PIXI.ratio,
            y: playVoiceButton.y,
            src: 'images/stop.png'
        }),
        trashButton = p_img(PIXI, {
            width: recordButton.width,
            x: playVoiceButton.x + playVoiceButton.width + 100 * PIXI.ratio,
            y: playVoiceButton.y,
            src: 'images/trash.png'
        });

    let clock,
        time = 0,
        playTime = 0;

    writeTime.hideFn();

    // 开始录音 “按钮” 开始
    recordButton.onClickFn(() => {
        callBack({
            status: 'record',
            drawFn(type) {
                if (type) return recordButton.hideFn();
                stopRecordButton.showFn();
                clock = setInterval(() => {
                    time++;
                    totalTimeFn(time);
                }, 1000);
            }
        });
    });
    // 开始录音 “按钮” 结束

    // 结束录音 “按钮” 开始
    stopRecordButton.onClickFn(() => {
        callBack({
            status: 'stopRecord',
            drawFn(type) {
                if (type) return stopRecordButton.hideFn();
                clearInterval(clock);
                writeTime.turnText(totalTime.text);
                totalTimeFn(0);
                isVisibleFn([writeTime, playVoiceButton, trashButton], 'showFn');
            }
        });
    });
    stopRecordButton.hideFn();
    // 结束录音 “按钮” 结束

    // 播放音频 “按钮” 开始
    playVoiceButton.onClickFn(() => {
        totalTimeFn(0);
        callBack({
            status: 'playVoice',
            drawFn(status) {
                switch (status) {
                    case 'play':
                        clock = setInterval(() => {
                            playTime++;
                            totalTimeFn(playTime);
                            if (playTime >= time) (playTime = 0), clearInterval(clock);
                        }, 1000);
                        playVoiceButton.hideFn();
                        stopVoiceButton.showFn();
                        trashButton.setPositionFn({ x: stopVoiceButton.x + stopVoiceButton.width + 225 * PIXI.ratio });
                        break;
                    case 'ended':
                        totalTimeFn(time);
                        playVoiceButton.showFn();
                        stopVoiceButton.hideFn();
                        trashButton.setPositionFn({ x: playVoiceButton.x + playVoiceButton.width + 100 * PIXI.ratio });
                        break;
                }
            }
        });
    });
    playVoiceButton.hideFn();
    // 播放音频 “按钮” 结束

    // 终止播放 “按钮” 开始
    stopVoiceButton.onClickFn(() => {
        callBack({
            status: 'stopVoic',
            drawFn() {
                playTime = 0;
                totalTimeFn(0);
                clearInterval(clock);
                playVoiceButton.showFn();
                stopVoiceButton.hideFn();
                trashButton.setPositionFn({ x: playVoiceButton.x + playVoiceButton.width + 100 * PIXI.ratio });
            }
        });
    });
    stopVoiceButton.hideFn();
    // 终止播放 “按钮” 结束

    // 销毁音频 “按钮” 开始
    trashButton.onClickFn(() => {
        callBack({
            status: 'trash',
            drawFn() {
                isVisibleFn([stopVoiceButton, playVoiceButton, trashButton], 'hideFn');
                trashButton.setPositionFn({ x: playVoiceButton.x + playVoiceButton.width + 100 * PIXI.ratio });

                time = playTime = 0;
                totalTimeFn(0);
                clearInterval(clock);
                recordButton.showFn();
                writeTime.hideFn();
            }
        });
    });
    trashButton.hideFn();
    // 销毁音频 “按钮” 结束

    function totalTimeFn(time) {
        let hour, minute, second;
        hour = (time / 3600) | 0;
        minute = ((time % 3600) / 60) | 0;
        second = (time % 3600) % 60;
        totalTime.turnText([hour, minute, second].map(item => ('00' + item).slice((item + '').length)).join(':'));
    }

    function isVisibleFn(arr, method) {
        for (let i = 0, len = arr.length; i < len; i++) {
            arr[i][method]();
        }
    }

    goBack.callBack = ()=>{
        callBack({status: 'stopRecord'});
        clearInterval(clock);
        callBack({status: 'trash'});
    }

    container.addChild(
        goBack,
        title,
        api_name,
        underline,
        totalTime,
        writeTime,
        recordButton,
        stopRecordButton,
        playVoiceButton,
        stopVoiceButton,
        trashButton,
        logo,
        logoName
    );

    app.stage.addChild(container);

    return container;
};
