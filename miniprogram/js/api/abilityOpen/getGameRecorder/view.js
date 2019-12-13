import { p_button, p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '游戏对局回放',
            api_name: 'getGameRecorder'
        }),
        box = p_box(PIXI, {
            height: 372 * PIXI.ratio,
            y: underline.height + underline.y + 24.4 * PIXI.ratio
        }),
        videoBox = p_box(PIXI, {
            height: 89 * PIXI.ratio,
            border: { width: PIXI.ratio | 0, color: 0xe5e5e5 },
            y: box.height + box.y + 24.4 * PIXI.ratio
        });

    // 绘制三角形 start
    let circumscribedRadius =
        (((Math.sqrt(3) * box.width) / 6) * ((Math.sqrt(3) * box.width) / 6) * ((Math.sqrt(3) * box.width) / 6)) /
        (4 * (box.width / 4) * (Math.sqrt(3) * (box.width / 12)));

    let trilateral = new PIXI.Graphics();
    trilateral
        .beginFill(0x1aad19)
        .drawPolygon([
            -(Math.sqrt(3) * (box.width / 12)),
            box.width / 4 - circumscribedRadius,
            Math.sqrt(3) * (box.width / 12),
            box.width / 4 - circumscribedRadius,
            0,
            -circumscribedRadius
        ])
        .endFill();
    trilateral.position.set(box.width / 2, box.height / 2);
    trilateral.scale.set(1.15, 1.15);
    box.addChild(trilateral);

    let rotatingFn = (() => {
        let angle = 0;
        return () => {
            angle === 360 && (angle = 5);
            angle += 5;
            trilateral.rotation = (angle * Math.PI) / 180;
        };
    })();
    app.ticker.add(rotatingFn);
    // 绘制三角形 end

    videoBox.addChild(
        p_text(PIXI, {
            content: `录屏 1`,
            fontSize: 34 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: videoBox.height }
        })
    );
    videoBox.hideFn();

    let start, pause, resume, abort, stop, del;

    // 开始录屏按钮 start
    start = p_button(PIXI, {
        width: 580 * PIXI.ratio,
        y: box.height + box.y + 80 * PIXI.ratio
    });
    start.myAddChildFn(
        p_text(PIXI, {
            content: `开始录屏`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: start.width, containerHeight: start.height }
        })
    );
    start.onClickFn(() => {
        start.hideFn();
        callBack({
            status: 'start',
            drawFn(res) {
                if (!res) return start.showFn();

                pause.showFn();
                abort.showFn();
                stop.showFn();
            }
        });
    });
    // 开始录屏按钮 end

    // 暂停录屏按钮 start
    pause = p_button(PIXI, {
        width: 576 * PIXI.ratio,
        height: 90 * PIXI.ratio,
        border: { width: (2 * PIXI.ratio) | 0, color: 0xd1d1d1 },
        y: start.height + start.y + 37 * PIXI.ratio,
        alpha: 0
    });
    pause.myAddChildFn(
        p_text(PIXI, {
            content: '暂停录制',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            relative_middle: { containerWidth: pause.width, containerHeight: pause.height }
        })
    );
    pause.onClickFn(() => {
        pause.hideFn();
        callBack({
            status: 'pause',
            drawFn(res) {
                res ? resume.showFn() : pause.showFn();
            }
        });
    });
    pause.hideFn();
    // 暂停录屏按钮 end

    // 继续录屏按钮 start
    resume = p_button(PIXI, {
        width: 576 * PIXI.ratio,
        height: 90 * PIXI.ratio,
        border: { width: (2 * PIXI.ratio) | 0, color: 0xd1d1d1 },
        y: pause.y,
        alpha: 0
    });
    resume.myAddChildFn(
        p_text(PIXI, {
            content: '继续录屏',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            relative_middle: { containerWidth: resume.width, containerHeight: resume.height }
        })
    );
    resume.onClickFn(() => {
        resume.hideFn();
        callBack({
            status: 'resume',
            drawFn(res) {
                res ? pause.showFn() : resume.showFn();
            }
        });
    });
    resume.hideFn();
    // 继续录屏按钮 end

    // 放弃录制游戏画面按钮 start
    abort = p_button(PIXI, {
        width: 576 * PIXI.ratio,
        height: 90 * PIXI.ratio,
        border: { width: (2 * PIXI.ratio) | 0, color: 0xd1d1d1 },
        y: start.height + start.y + 167 * PIXI.ratio,
        alpha: 0
    });
    abort.myAddChildFn(
        p_text(PIXI, {
            content: '放弃录制',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            relative_middle: { containerWidth: abort.width, containerHeight: abort.height }
        })
    );
    abort.onClickFn(() => {
        let pauseVisible = pause.visible,
            resumeVisible = resume.visible;
        abortStopPublicFn(abort, stop, 'hideFn', pauseVisible, resumeVisible);
        callBack({
            status: 'abort',
            drawFn(res) {
                res ? start.showFn() : abortStopPublicFn(abort, stop, 'showFn', pauseVisible, resumeVisible);
            }
        });
    });
    abort.hideFn();
    // 放弃录制游戏画面按钮 end

    // 完成录屏按钮 start
    stop = p_button(PIXI, {
        width: start.width,
        y: start.y
    });
    stop.myAddChildFn(
        p_text(PIXI, {
            content: `完成`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: stop.width, containerHeight: stop.height }
        })
    );
    stop.onClickFn(() => {
        let pauseVisible = pause.visible,
            resumeVisible = resume.visible;
        abortStopPublicFn(stop, abort, 'hideFn', pauseVisible, resumeVisible);
        callBack({
            status: 'stop',
            style: {
                left: (320 * obj.width) / (375 * obj.pixelRatio),
                top: (videoBox.y + 19 * PIXI.ratio) / obj.pixelRatio,
                fontSize: (17 * obj.width) / (375 * obj.pixelRatio)
            },
            drawFn(res) {
                res ? videoBox.showFn() : abortStopPublicFn(stop, abort, 'showFn', pauseVisible, resumeVisible);
            }
        });
    });
    stop.hideFn();
    // 完成录屏按钮 end

    // 删除录制好的视频按钮 start
    del = p_button(PIXI, {
        width: 68 * PIXI.ratio,
        height: 48 * PIXI.ratio,
        x: videoBox.width - 193 * PIXI.ratio,
        y: (41.5 * PIXI.ratio) / 2,
        alpha: 0
    });
    del.myAddChildFn(
        p_text(PIXI, {
            content: `删除`,
            fontSize: (34 * PIXI.ratio) | 0,
            fill: 0x576b95,
            relative_middle: { containerWidth: del.width, containerHeight: del.height }
        })
    );
    del.onClickFn(() => {
        start.showFn();
        videoBox.hideFn();
        callBack({ status: 'hide' });
    });
    videoBox.addChild(del);
    // 删除录制好的视频按钮 end

    function abortStopPublicFn(target, button, funcName, pauseVisible, resumeVisible) {
        target[funcName]();
        pauseVisible && pause[funcName]();
        resumeVisible && resume[funcName]();
        button[funcName]();
    }

    window.router.getNowPage(page => {
        page.reload = function() {
            app.ticker.add(rotatingFn);
            del.visible && callBack({ status: 'show' });
            logo.turnImg({ src: 'images/logo.png' });
        };
    });

    container.addChild(goBack, title, api_name, underline, box, videoBox, start, pause, resume, abort, stop, logo, logoName);
    app.stage.addChild(container);

    return container;
};
