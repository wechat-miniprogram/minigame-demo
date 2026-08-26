/**
 * Web Audio
 * wx.createWebAudioContext
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/audio/wx.createWebAudioContext.html
 *
 * 演示：AudioBuffer / BufferSourceNode / AudioListener / AudioParam
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮操作 WebAudio，音频信息将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'webAudio';
let ctx: any = null;

function ensure() {
  if (!ctx) ctx = wx.createWebAudioContext();
  return ctx;
}

/** 用 OscillatorNode 播一个 440Hz 蜂鸣音 0.5 秒 */
export function playBeep() {
  const c = ensure();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = 440;
  gain.gain.value = 0.2;
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  setTimeout(() => osc.stop(), 500);
  setInfo(
    formatObj({
      sampleRate: c.sampleRate,
      currentTime: c.currentTime.toFixed(2),
      state: c.state,
      操作: '已播放 440Hz / 0.5s',
    })
  );
}

/** 创建 AudioBuffer 并通过 BufferSourceNode 播放 */
export function playAudioBuffer() {
  const c = ensure();
  const sampleRate = c.sampleRate;
  const duration = 1;
  const length = sampleRate * duration;
  const buffer = c.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  // 生成 440Hz 正弦波
  for (let i = 0; i < length; i++) {
    data[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.3;
  }

  const source = c.createBufferSource();
  source.buffer = buffer;
  source.connect(c.destination);
  source.start();

  setInfo(
    formatObj({
      类型: 'AudioBuffer',
      采样率: sampleRate,
      声道数: buffer.numberOfChannels,
      时长: duration + 's',
      采样数: length,
      操作: '440Hz 正弦波 1s',
    })
  );
}

/** 演示 AudioListener 空间音频 */
export function demoListener() {
  const c = ensure();
  const listener = c.listener;

  // 设置听者位置
  if (typeof listener.positionX !== 'undefined') {
    listener.positionX.value = 0;
    listener.positionY.value = 0;
    listener.positionZ.value = 1;
  }

  // 创建声源并在空间中移动
  const osc = c.createOscillator();
  const gain = c.createGain();
  const panner = c.createPanner();
  osc.frequency.value = 300;
  gain.gain.value = 0.3;
  osc.connect(gain);
  gain.connect(panner);
  panner.connect(c.destination);
  panner.positionX.value = 5;
  panner.positionY.value = 0;
  panner.positionZ.value = 0;
  osc.start();
  setTimeout(() => osc.stop(), 1000);

  setInfo(
    formatObj({
      类型: 'AudioListener + PannerNode',
      听者位置: 'z=1',
      声源位置: 'x=5',
      操作: '空间音频 300Hz / 1s',
    })
  );
}

/** 演示 AudioParam 自动化 */
export function demoAudioParam() {
  const c = ensure();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);

  // AudioParam 自动化：频率从 200Hz 线性渐变到 800Hz
  osc.frequency.setValueAtTime(200, c.currentTime);
  osc.frequency.linearRampToValueAtTime(800, c.currentTime + 2);

  // 音量淡出
  gain.gain.setValueAtTime(0.3, c.currentTime);
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 2);

  osc.start();
  osc.stop(c.currentTime + 2);

  setInfo(
    formatObj({
      类型: 'AudioParam 自动化',
      频率: '200Hz → 800Hz',
      音量: '0.3 → 0',
      时长: '2s',
    })
  );
}

/** 关闭上下文 */
export function closeContext() {
  if (ctx) {
    ctx.close?.();
    ctx = null;
    setInfo('已关闭 WebAudioContext');
  }
}

export function onUnload() {
  closeContext();
}
