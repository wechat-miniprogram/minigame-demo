/**
 * InnerAudioContext
 * wx.createInnerAudioContext / wx.setInnerAudioOption / wx.getAvailableAudioSources
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/audio/wx.createInnerAudioContext.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮播放/暂停/停止内部音频。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'innerAudio';
const SRC = 'https://wxamusic.wx.qq.com/wxag/xingji/music/bg1.mp3';
let audio: any = null;
let rebooting: any = null;

function ensure() {
  if (audio) return audio;
  audio = wx.createInnerAudioContext({ useWebAudioImplement: false });
  audio.src = SRC;

  audio.onPlay(() =>
    setInfo(formatObj({ 状态: '播放中', src: SRC.slice(-20) }))
  );
  audio.onPause(() => setInfo('状态: 已暂停'));
  audio.onStop(() => setInfo('状态: 已停止'));
  audio.onEnded(() => {
    setInfo('状态: 播放结束');
    audio.offTimeUpdate();
    audio.isInterruption = false;
  });
  audio.onError((err: any) => {
    const errMap: Record<number, string> = {
      10001: '系统错误',
      10002: '网络错误',
      10003: '文件错误',
      10004: '格式错误',
      [-1]: '未知错误',
    };
    setInfo(`错误: ${errMap[err?.errCode] || err?.errMsg || '未知'}`);
  });

  // 中断恢复
  audio.onPause(() => {
    if (rebooting) return;
    new Promise((resolve) => {
      rebooting = resolve;
      wx.onAudioInterruptionEnd(rebooting);
      wx.onShow(rebooting);
    }).then(() => {
      wx.offShow(rebooting);
      wx.offAudioInterruptionEnd(rebooting);
      rebooting = null;
      if (audio?.isInterruption) audio.play();
    });
  });

  return audio;
}

/** 播放 */
export function play() {
  const a = ensure();
  a.play();
  a.isInterruption = true;
}

/** 查看播放进度 */
export function showProgress() {
  if (!audio) {
    wx.showToast({ title: '请先播放音频', icon: 'none' });
    return;
  }
  setInfo(
    formatObj({
      当前时间: `${audio.currentTime.toFixed(1)}s`,
      总时长: `${audio.duration.toFixed(1)}s`,
    })
  );
}

/** 暂停 */
export function pause() {
  if (audio) {
    audio.pause();
    audio.isInterruption = false;
  }
}

/** 停止 */
export function stop() {
  if (audio) {
    audio.stop();
    audio.isInterruption = false;
  }
}

/** 跳到 5 秒 */
export function seek5() {
  ensure().seek(5);
  setInfo('已跳到 5 秒');
}

/** 设置音频选项 */
export function setOption() {
  wx.setInnerAudioOption({
    mixWithOther: true,
    obeyMuteSwitch: false,
    success() {
      setInfo('已设置 mixWithOther=true');
    },
    fail(err: any) {
      setInfo(`设置失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 查询可用录音音源 */
export function getAvailableSources() {
  wx.getAvailableAudioSources({
    success(res: any) {
      setInfo(
        formatObj({
          音源数: (res?.audioSources || []).length,
          列表: (res?.audioSources || []).join(', '),
        })
      );
    },
    fail(err: any) {
      setInfo(`查询失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

export function onUnload() {
  if (audio) {
    audio.destroy();
    audio = null;
  }
  if (rebooting) {
    wx.offShow(rebooting);
    wx.offAudioInterruptionEnd(rebooting);
    rebooting = null;
  }
}
