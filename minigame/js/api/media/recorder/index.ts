/**
 * 录音管理器
 * wx.getRecorderManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/recorder/wx.getRecorderManager.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮开始/停止录音，录音状态和文件信息将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'recorder';
let recorder: any = null;
let tempPath = '';

function ensure() {
  const { platform } = wx.getSystemInfoSync();
  if (platform === 'windows' || platform === 'mac') {
    wx.showToast({ title: '该功能仅支持移动端', icon: 'none', duration: 1000 });
    return null;
  }
  if (recorder) return recorder;
  recorder = wx.getRecorderManager();
  recorder.onStart(() => setInfo('状态: 开始录音'));
  recorder.onPause(() => setInfo('状态: 录音暂停'));
  recorder.onResume(() => setInfo('状态: 录音恢复'));
  recorder.onStop((res: any) => {
    tempPath = res?.tempFilePath || '';
    setInfo(
      formatObj({
        状态: '录音结束',
        时长: `${res?.duration ?? 0} ms`,
        大小: `${res?.fileSize ?? 0} B`,
        路径: tempPath.slice(-30),
      })
    );
  });
  recorder.onError((err: any) => setInfo(`录音错误: ${err?.errMsg || '未知错误'}`));
  return recorder;
}

/** 开始录音（10s 上限） */
export function start() {
  const r = ensure();
  if (!r) return;
  r.start({
    duration: 10000,
    sampleRate: 44100,
    numberOfChannels: 1,
    encodeBitRate: 192000,
    format: 'aac',
    frameSize: 50,
  });
}

/** 暂停 */
export function pause() {
  ensure()?.pause();
}
/** 恢复 */
export function resume() {
  ensure()?.resume();
}
/** 停止 */
export function stop() {
  ensure()?.stop();
}

/** 播放上一次录音 */
export function playLast() {
  if (!tempPath) {
    wx.showToast({ title: '请先录一段音频', icon: 'none' });
    return;
  }
  const audio = wx.createInnerAudioContext();
  audio.src = tempPath;
  audio.onEnded(() => audio.destroy());
  audio.onError(() => audio.destroy());
  audio.play();
  setInfo('状态: 播放录音');
}

export function onUnload() {
  if (recorder) {
    try {
      recorder.stop();
    } catch {
      console.log('recorder stop error');
    }
    recorder = null;
  }
}
