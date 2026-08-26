/**
 * 媒体音频播放器
 * wx.createMediaAudioPlayer
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/audio/wx.createMediaAudioPlayer.html
 *
 * MediaAudioPlayer 专门配合 VideoDecoder 播放音频流。
 * 流程：创建解码器 → 解码器 start → 音频播放器 start → addAudioSource(解码器) → 帧循环渲染
 * 本页面同时展示视频帧（作为音频效果的视觉反馈）。
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const SRC =
  'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/video.mp4';

let decoder: any = null;
let player: any = null;
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
          音频: player ? '播放中' : '未启用',
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

/** 启动：创建解码器 + 音频播放器 */
export function start() {
  const { platform } = wx.getSystemInfoSync();
  if (platform === 'windows' || platform === 'mac') {
    toast('该功能仅支持移动端');
    return;
  }

  // 清理旧实例
  destroyAll(true);

  // 创建视频解码器
  if (typeof wx.createVideoDecoder !== 'function') {
    toast('当前环境不支持视频解码器');
    return;
  }
  decoder = wx.createVideoDecoder();
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

  // 启动解码器（Promise 方式获取 fps）
  decoder.start?.({ source: SRC, mode: 0 }).then((data: any) => {
    toast('解码已开始');
    if (data?.fps) {
      wx.setPreferredFramesPerSecond(data.fps);
    }

    // 创建并启动音频播放器
    if (typeof (wx as any).createMediaAudioPlayer !== 'function') {
      toast('当前环境不支持 MediaAudioPlayer');
      startRenderLoop();
      return;
    }

    player = (wx as any).createMediaAudioPlayer();
    player.volume = 0.5;

    player.start().then(() => {
      return player.addAudioSource(decoder);
    }).then(() => {
      toast('音频播放已启动');
      startRenderLoop();
    }).catch((err: any) => {
      toast(`音频启动失败: ${err?.errMsg || err}`);
      // 音频失败也继续渲染视频帧
      startRenderLoop();
    });
  }).catch((err: any) => {
    toast(`解码启动失败: ${err?.errMsg || err}`);
  });
}

/** 停止 */
export function stopAll() {
  stopRenderLoop();
  if (player) {
    player.stop?.().catch(() => {});
  }
  if (decoder) {
    decoder.stop?.();
  }
  toast('已停止');
}

/** 销毁 */
export function destroyAll(silent = false) {
  stopRenderLoop();

  if (player) {
    if (decoder) {
      player.removeAudioSource?.(decoder).catch(() => {});
    }
    player.stop?.().catch(() => {});
    player.destroy?.().catch(() => {});
    player = null;
  }
  if (decoder) {
    decoder.stop?.();
    decoder.off?.('stop');
    decoder.off?.('ended');
    decoder.off?.('error');
    decoder.remove?.();
    decoder = null;
  }

  frameCanvas = null;
  frameCtx = null;
  lastFrameInfo = '';
  display.clear();
  if (!silent) {
    toast('已销毁');
  }
}

export function onUnload() {
  destroyAll(true);
}
