/**
 * 视频解码器
 * wx.createVideoDecoder
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/video-decoder/wx.createVideoDecoder.html
 *
 * 核心：解码器 start 后，通过 requestAnimationFrame 循环调用 getFrameData()
 * 逐帧获取解码数据，渲染到展示区 canvas 纹理上
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const SRC =
  'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/video.mp4';
let decoder: any = null;
let frameCanvas: any = null;
let frameCtx: any = null;
let animId: number = 0;
let isRunning = false;

function toast(title: string) {
  wx.showToast({ title, icon: 'none' });
}

/** 将帧数据绘制到离屏 canvas */
function renderFrame(frame: { width: number; height: number; data: ArrayBuffer }) {
  if (!frameCanvas) {
    frameCanvas = wx.createCanvas();
    frameCtx = frameCanvas.getContext('2d');
  }
  if (frameCanvas.width !== frame.width || frameCanvas.height !== frame.height) {
    frameCanvas.width = frame.width;
    frameCanvas.height = frame.height;
  }
  const imageData = (wx as any).createImageData
    ? (wx as any).createImageData(frame.width, frame.height)
    : frameCtx.createImageData(frame.width, frame.height);
  const src = new Uint8Array(frame.data);
  const dst = imageData.data;
  for (let i = 0; i < dst.length && i < src.length; i++) {
    dst[i] = src[i];
  }
  frameCtx.putImageData(imageData, 0, 0);
}

/** 上一次的帧信息，用于判断是否需要更新 info 文本 */
let lastFrameInfo = '';

/** 循环读取帧数据并渲染 */
function startRenderLoop() {
  if (isRunning) return;
  isRunning = true;

  const update = () => {
    if (!isRunning || !decoder) {
      isRunning = false;
      return;
    }
    const frame = decoder.getFrameData?.();
    if (frame && frame.data) {
      renderFrame(frame);
      display.image(frameCanvas);

      const info = `${frame.width}x${frame.height}|${frame.pkPts ?? '-'}|${frame.data.byteLength}`;
      if (info !== lastFrameInfo) {
        lastFrameInfo = info;
        display.data({
          宽度: frame.width,
          高度: frame.height,
          pts: frame.pkPts ?? '-',
          数据大小: `${frame.data.byteLength} B`,
        });
      }
    }
    animId = requestAnimationFrame(update);
  };
  animId = requestAnimationFrame(update);
}

/** 停止渲染循环 */
function stopRenderLoop() {
  isRunning = false;
  if (animId) {
    cancelAnimationFrame(animId);
    animId = 0;
  }
}

/** 创建解码器并开始解码 */
export function createDecoder() {
  const { platform } = wx.getSystemInfoSync();
  if (platform === 'windows' || platform === 'mac') {
    toast('该功能仅支持移动端');
    return;
  }
  if (decoder) {
    stopRenderLoop();
    decoder.remove?.();
    decoder = null;
  }
  if (typeof wx.createVideoDecoder !== 'function') {
    toast('当前环境不支持视频解码器');
    return;
  }
  decoder = wx.createVideoDecoder();
  decoder.on?.('start', () => {
    toast('解码已开始');
    startRenderLoop();
  });
  decoder.on?.('seek', () => toast('seek 完成'));
  decoder.on?.('stop', () => {
    toast('解码停止');
    stopRenderLoop();
  });
  decoder.on?.('ended', () => {
    toast('解码结束');
    stopRenderLoop();
  });
  decoder.on?.('error', (err: any) => {
    toast(`解码错误: ${err?.errMsg || '未知'}`);
    stopRenderLoop();
  });
  decoder.start?.({ source: SRC, mode: 0 });
}

/** seek 到 2 秒 */
export function seek2s() {
  if (!decoder) {
    toast('请先创建解码器');
    return;
  }
  decoder.seek?.(2000);
  toast('已 seek 到 2 秒');
}

/** 停止解码 */
export function stop() {
  if (!decoder) {
    toast('请先创建解码器');
    return;
  }
  decoder.stop?.();
  stopRenderLoop();
  toast('已停止解码');
}

/** 销毁解码器 */
export function destroyAll() {
  stopRenderLoop();
  if (decoder) {
    decoder.stop?.();
    decoder.off?.('start');
    decoder.off?.('seek');
    decoder.off?.('stop');
    decoder.off?.('ended');
    decoder.off?.('error');
    decoder.remove?.();
    decoder = null;
    frameCanvas = null;
    frameCtx = null;
    lastFrameInfo = '';
    display.clear();
    toast('已销毁解码器');
  }
}

export function onUnload() {
  destroyAll();
}
