/**
 * 应用级事件
 * wx.onError / wx.offError / wx.onUnhandledRejection / wx.offUnhandledRejection /
 * wx.onAudioInterruptionBegin / wx.onAudioInterruptionEnd /
 * wx.offAudioInterruptionBegin / wx.offAudioInterruptionEnd
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/app/app-event/wx.onError.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击下方按钮注册/触发/取消全局事件监听，事件信息将在此区域实时展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'appEvent';
let errorListener: ((res: any) => void) | null = null;
let rejectionListener: ((res: any) => void) | null = null;
let audioBeginListener: (() => void) | null = null;
let audioEndListener: (() => void) | null = null;
let errorCount = 0;
let rejectionCount = 0;

/** 监听全局错误事件 */
export function onError() {
  if (errorListener) {
    wx.showToast({ title: '已在监听 onError', icon: 'none' });
    return;
  }
  errorCount = 0;
  errorListener = (res: any) => {
    errorCount += 1;
    const data: Record<string, any> = {
      onError触发次数: errorCount,
      最近错误: res.message || res,
    };
    setInfo(formatObj(data));
  };
  wx.onError(errorListener);
  wx.showToast({ title: '已注册 onError，点击"触发错误"测试', icon: 'none' });
}

/** 故意抛出一个错误 */
export function triggerError() {
  setTimeout(() => {
    throw new Error('测试 onError - ' + new Date().toLocaleTimeString());
  }, 10);
}

/** 停止监听全局错误 */
export function offError() {
  if (errorListener) {
    wx.offError(errorListener);
    errorListener = null;
    wx.showToast({ title: '已停止 onError 监听', icon: 'none' });
  }
}

/** 监听未处理的 Promise 异常 */
export function onUnhandledRejection() {
  if (rejectionListener) {
    wx.showToast({ title: '已在监听 onUnhandledRejection', icon: 'none' });
    return;
  }
  rejectionCount = 0;
  rejectionListener = (res: any) => {
    rejectionCount += 1;
    const data: Record<string, any> = {
      Rejection触发次数: rejectionCount,
      最近原因: res.reason,
    };
    setInfo(formatObj(data));
  };
  wx.onUnhandledRejection(rejectionListener);
  wx.showToast({ title: '已注册 onUnhandledRejection', icon: 'none' });
}

/** 故意触发一个未处理的 Promise reject */
export function triggerUnhandledRejection() {
  new Promise((_, reject) => {
    setTimeout(() => reject('测试 unhandledRejection - ' + Date.now()), 10);
  });
}

/** 停止监听 Promise 异常 */
export function offUnhandledRejection() {
  if (rejectionListener) {
    wx.offUnhandledRejection(rejectionListener);
    rejectionListener = null;
    wx.showToast({ title: '已停止 onUnhandledRejection 监听', icon: 'none' });
  }
}

/** 监听音频中断（来电、其他 App 抢占音频时触发） */
export function onAudioInterruption() {
  audioBeginListener = () => {
    setInfo('音频被中断（Begin）');
  };
  audioEndListener = () => {
    setInfo('音频中断结束（End）');
  };
  wx.onAudioInterruptionBegin(audioBeginListener);
  wx.onAudioInterruptionEnd(audioEndListener);
  wx.showToast({ title: '已注册音频中断监听', icon: 'none' });
}

/** 停止监听音频中断 */
export function offAudioInterruption() {
  if (audioBeginListener) {
    wx.offAudioInterruptionBegin(audioBeginListener);
    audioBeginListener = null;
  }
  if (audioEndListener) {
    wx.offAudioInterruptionEnd(audioEndListener);
    audioEndListener = null;
  }
  wx.showToast({ title: '已停止音频中断监听', icon: 'none' });
}

export function onUnload() {
  offError();
  offUnhandledRejection();
  offAudioInterruption();
}
