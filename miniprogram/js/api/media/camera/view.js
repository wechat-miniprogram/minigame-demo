import fixedTemplate from '../../../libs/template/fixed';
import { p_scroll, p_button, p_text, p_img } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '相机',
            api_name: 'createCamera'
        }),
        scroll = p_scroll(PIXI, {
            height: obj.height
        }),
        switchButton = p_button(PIXI, {
            width: 370 * PIXI.ratio,
            height: 80 * PIXI.ratio,
            y: underline.y + underline.height + 630 * PIXI.ratio
        }),
        takePhotosButton = p_button(PIXI, {
            width: switchButton.width,
            height: switchButton.height,
            y: switchButton.height + switchButton.y + 40 * PIXI.ratio
        }),
        startRecordButton = p_button(PIXI, {
            width: switchButton.width,
            height: switchButton.height,
            y: takePhotosButton.height + takePhotosButton.y + 40 * PIXI.ratio
        }),
        stopRecordButton = p_button(PIXI, {
            width: switchButton.width,
            height: switchButton.height,
            y: startRecordButton.height + startRecordButton.y + 40 * PIXI.ratio
        }),
        preview = p_text(PIXI, {
            content: '预览',
            fontSize: 30 * PIXI.ratio,
            y: stopRecordButton.height + stopRecordButton.y + 50 * PIXI.ratio,
            relative_middle: { point: scroll.width / 2 }
        }),
        photo,
        video,
        startVideo;

    // 切换摄像头 “按钮” 开始
    switchButton.myAddChildFn(
        p_text(PIXI, {
            content: '切换摄像头',
            fontSize: 32 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: switchButton.width, containerHeight: switchButton.height }
        })
    );
    switchButton.onClickFn(() => {
        callBack({
            status: 'devicePosition'
        });
    });
    // 切换摄像头 “按钮” 结束

    // 拍照 “按钮” 开始
    takePhotosButton.myAddChildFn(
        p_text(PIXI, {
            content: '拍照',
            fontSize: 32 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: takePhotosButton.width, containerHeight: takePhotosButton.height }
        })
    );
    takePhotosButton.onClickFn(() => {
        callBack({
            status: 'takePhoto',
            drawFn(res) {
                loadPicture(res);
                changeScrollHeight(photo.y + photo.height + 100 * PIXI.ratio);
            }
        });
    });
    function loadPicture(res) {
        if (!photo) {
            photo = p_img(PIXI, {
                width: 750 * PIXI.ratio,
                height: 500 * PIXI.ratio,
                y: preview.y + preview.height + 80 * PIXI.ratio,
                src: res.tempImagePath || res.tempThumbPath
            });
            scroll.myAddChildFn(photo);
        } else {
            photo.turnImg({ src: res.tempImagePath || res.tempThumbPath });
        }
    }
    // 拍照 “按钮” 结束

    // 开始录像 “按钮” 开始
    startRecordButton.myAddChildFn(
        p_text(PIXI, {
            content: '开始录像',
            fontSize: 32 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: startRecordButton.width, containerHeight: startRecordButton.height }
        })
    );
    startRecordButton.onClickFn(() => {
        callBack({
            status: 'startRecord'
        });
    });
    // 开始录像 “按钮” 结束

    // 结束录像 “按钮” 开始
    stopRecordButton.myAddChildFn(
        p_text(PIXI, {
            content: '结束录像',
            fontSize: 32 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: stopRecordButton.width, containerHeight: stopRecordButton.height }
        })
    );
    stopRecordButton.onClickFn(() => {
        callBack({
            status: 'stopRecord',
            drawFn(res) {
                loadPicture(res);
                loadVideo(res);
                changeScrollHeight(photo.y + photo.height + 600 * PIXI.ratio);
            }
        });
    });

    let videoPositionY;
    function loadVideo(res) {
        if (!startVideo) {
            videoPositionY = (photo.y + photo.height + 50 * PIXI.ratio) / obj.pixelRatio;
            video = wx.createVideo({
                x: 0,
                y: videoPositionY,
                width: obj.width / obj.pixelRatio,
                height: (225 * obj.width) / (375 * obj.pixelRatio),
                controls: true,
                src: res.tempVideoPath,
                poster: res.tempThumbPath
            });
            startVideo = true;
        } else {
            video.src = res.tempVideoPath;
        }
    }
    // 结束录像 “按钮” 结束

    // 创建相机 开始
    !wx.createCamera && wx.createCamera();
    let cameraPositionY = (underline.y + underline.height + 80 * PIXI.ratio) / obj.pixelRatio;
    callBack({
        status: 'createCamera',
        data: {
            x: 0,
            y: cameraPositionY,
            width: obj.width / obj.pixelRatio,
            height: (250 * obj.width) / (375 * obj.pixelRatio)
        }
    });
    // 创建相机 结束

    function changeScrollHeight(y, forced) {
        if (y > logoName.y || forced) {
            logo.setPositionFn({ y: y - 4 * PIXI.ratio });
            logoName.setPositionFn({ y });
            scroll.totalHeight = logoName.y + logoName.height + 31 * PIXI.ratio;
            scroll.scroller.contentSize(scroll.width, scroll.height, scroll.width, scroll.totalHeight);
        }
    }

    scroll.myAddChildFn(goBack, title, api_name, underline, switchButton, takePhotosButton, startRecordButton, stopRecordButton, preview, logo, logoName);

    changeScrollHeight(preview.y + preview.height + 130 * PIXI.ratio, true);

    scroll.monitor = y => {
        callBack({ status: 'longitudinalShift', offsetY: cameraPositionY + y / obj.pixelRatio });
        startVideo && (video.y = videoPositionY + y / obj.pixelRatio);
    };

    goBack.callBack = () => {
        callBack({ status: 'destroy' });
        startVideo && video.destroy();
    };

    container.addChild(scroll);
    app.stage.addChild(container);

    return container;
};
