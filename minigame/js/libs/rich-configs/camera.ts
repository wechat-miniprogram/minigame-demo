/**
 * camera rich-config
 *
 * 参照 minigame-demo/miniprogram/js/api/media/camera/view.js 实现：
 * - scroll 从 underlineBottom 开始，高度覆盖下方全屏（不覆盖标题区）
 * - 按钮使用相对坐标（相对于 scroll 内部 y=0 = underlineBottom）
 * - 相机 Y = (underlineBottom + 80*ratio) / pixelRatio（屏幕绝对坐标）
 * - scroll.monitor 同步原生组件位置
 * - changeScrollHeight 动态调整内容高度
 */

import * as logic from '../../api/media/camera/index';
import type { RichConfig } from '../rich-renderer';

let _camera: any = null;
let _video: any = null;

export const config: RichConfig = {
  title: '相机',
  apiName: 'camera',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_button, p_img, p_scroll } = require('../component/index');

    const underlineBottom = underline ? underline.y + underline.height : 0;

    // ====== 滚动容器：从 underline 下方开始，高度覆盖剩余空间 ======
    // scroll 内部 y=0 对应屏幕 underlineBottom 位置
    // 这样 scroll 有 mask 裁剪，内容不会溢出到上方覆盖标题
    const scrollH = obj.height - underlineBottom;
    const scroll = p_scroll(PIXI, { height: scrollH });
    scroll.position.y = underlineBottom;

    // ====== 按钮（坐标相对于 scroll 内部 y=0 = 屏幕 underlineBottom）======
    // demo 中按钮绝对 Y = underlineBottom + 630*ratio
    // scroll 内部相对 Y = 630*ratio
    const switchButton = p_button(PIXI, {
      width: 370 * PIXI.ratio,
      height: 80 * PIXI.ratio,
      y: 630 * PIXI.ratio,
    });
    const takePhotosButton = p_button(PIXI, {
      width: switchButton.width,
      height: switchButton.height,
      y: switchButton.height + switchButton.y + 40 * PIXI.ratio,
    });
    const startRecordButton = p_button(PIXI, {
      width: switchButton.width,
      height: switchButton.height,
      y: takePhotosButton.height + takePhotosButton.y + 40 * PIXI.ratio,
    });
    const stopRecordButton = p_button(PIXI, {
      width: switchButton.width,
      height: switchButton.height,
      y: startRecordButton.height + startRecordButton.y + 40 * PIXI.ratio,
    });
    const preview = p_text(PIXI, {
      content: '预览',
      fontSize: 30 * PIXI.ratio,
      y: stopRecordButton.height + stopRecordButton.y + 50 * PIXI.ratio,
      relative_middle: { point: scroll.width / 2 },
    });

    // 切换摄像头按钮
    switchButton.myAddChildFn(
      p_text(PIXI, {
        content: 'switchCamera',
        fontSize: 32 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: { containerWidth: switchButton.width, containerHeight: switchButton.height },
      })
    );
    switchButton.onClickFn(() => {
      try { logic.switchCamera(); } catch (e) {}
    });

    // 拍照按钮
    takePhotosButton.myAddChildFn(
      p_text(PIXI, {
        content: 'takePhoto',
        fontSize: 32 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: { containerWidth: takePhotosButton.width, containerHeight: takePhotosButton.height },
      })
    );
    takePhotosButton.onClickFn(() => {
      try { logic.takePhoto(); } catch (e) {}
    });

    // 开始录像按钮
    startRecordButton.myAddChildFn(
      p_text(PIXI, {
        content: 'startRecord',
        fontSize: 32 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: { containerWidth: startRecordButton.width, containerHeight: startRecordButton.height },
      })
    );
    startRecordButton.onClickFn(() => {
      try { logic.startRecord(); } catch (e) {}
    });

    // 结束录像按钮
    stopRecordButton.myAddChildFn(
      p_text(PIXI, {
        content: 'stopRecord',
        fontSize: 32 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: { containerWidth: stopRecordButton.width, containerHeight: stopRecordButton.height },
      })
    );
    stopRecordButton.onClickFn(() => {
      try { logic.stopRecord(); } catch (e) {}
    });

    preview.visible = false;

    // 图片和视频变量
    let photo: any = null;
    let startVideo = false;
    let videoPositionY: number = 0;

    // 加载图片（与 demo 第75-85行一致）
    function loadPicture(res: { tempImagePath?: string; tempThumbPath?: string }) {
      if (!photo) {
        photo = p_img(PIXI, {
          width: 750 * PIXI.ratio,
          height: 500 * PIXI.ratio,
          y: preview.y + preview.height + 80 * PIXI.ratio,
          src: res.tempImagePath || res.tempThumbPath,
        });
        scroll.myAddChildFn(photo);
      } else {
        photo.turnImg({ src: res.tempImagePath || res.tempThumbPath });
      }
    }

    // 加载视频（与 demo 第108-122行一致）
    // videoPositionY 是屏幕绝对物理像素 Y：underlineBottom + scroll内部偏移 / pixelRatio
    function loadVideo(res: { tempVideoPath: string; tempThumbPath?: string }) {
      if (!startVideo) {
        // photo.y 是 scroll 内部坐标，需要加上 underlineBottom 转为屏幕绝对坐标
        videoPositionY = (underlineBottom + photo.y + photo.height + 50 * PIXI.ratio) / obj.pixelRatio;
        _video = wx.createVideo({
          x: 0,
          y: videoPositionY,
          width: obj.width / obj.pixelRatio,
          height: (225 * obj.width) / (375 * obj.pixelRatio),
          controls: true,
          src: res.tempVideoPath,
          poster: res.tempThumbPath || '',
        });
        startVideo = true;
      } else {
        _video.src = res.tempVideoPath;
      }
    }

    // 调整滚动内容高度
    function changeScrollHeight(y: number) {
      const totalHeight = y + 130 * PIXI.ratio;
      scroll.scroller.contentSize(scroll.width, scroll.height, scroll.width, totalHeight);
    }

    // 监听业务层结果回调
    logic.setOnResult((res: { type: 'photo' | 'video'; tempImagePath?: string; tempThumbPath?: string; tempVideoPath?: string }) => {
      preview.visible = true;

      if (res.type === 'photo' && res.tempImagePath) {
        loadPicture({ tempImagePath: res.tempImagePath });
        changeScrollHeight(photo.y + photo.height + 100 * PIXI.ratio);
      } else if (res.type === 'video' && res.tempVideoPath) {
        loadPicture({ tempThumbPath: res.tempThumbPath });
        loadVideo(res);
        changeScrollHeight(photo.y + photo.height + 600 * PIXI.ratio);
      }
    });

    // 添加所有组件到 scroll
    scroll.myAddChildFn(switchButton, takePhotosButton, startRecordButton, stopRecordButton, preview);

    // 初始化滚动高度
    changeScrollHeight(preview.y + preview.height + 130 * PIXI.ratio);

    // 创建相机 — 相机 Y 是屏幕绝对物理像素坐标
    // 屏幕 Y = underlineBottom + 80*ratio → 物理像素 = (underlineBottom + 80*ratio) / pixelRatio
    const cameraPositionY = (underlineBottom + 80 * PIXI.ratio) / obj.pixelRatio;
    logic.createCamera({
      x: 0,
      y: cameraPositionY,
      width: obj.width / obj.pixelRatio,
      height: (250 * obj.width) / (375 * obj.pixelRatio),
    }).then((cam: any) => {
      _camera = cam;
    });

    // 滚动同步原生组件位置
    // scroll.monitor(y) 中 y 是滚动偏移（向下滚时 y 为负）
    // 相机屏幕 Y = cameraPositionY + y/pixelRatio
    scroll.monitor = (y: number) => {
      if (_camera) {
        _camera.y = cameraPositionY + y / obj.pixelRatio;
      }
      if (startVideo && _video) {
        _video.y = videoPositionY + y / obj.pixelRatio;
      }
    };

    return scroll;
  },

  actions: [],

  onUnload() {
    if (_video) {
      _video.destroy();
      _video = null;
    }
    if (_camera) {
      _camera.destroy();
      _camera = null;
    }
    logic.onUnload();
  },
};
