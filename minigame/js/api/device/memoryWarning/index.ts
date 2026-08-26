/**
 * 内存预警
 * wx.onMemoryWarning / wx.offMemoryWarning
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/memory/wx.onMemoryWarning.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮注册内存告警监听，触发时告警信息将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'memoryWarning';
let listener: ((res: any) => void) | null = null;
let warningCount = 0;

/** 监听内存预警 */
export function onMemoryWarning() {
  if (listener) {
    wx.showToast({ title: '已在监听', icon: 'none' });
    return;
  }
  warningCount = 0;
  listener = (res: any) => {
    warningCount += 1;
    setInfo(
      `触发次数: ${warningCount}\n警告等级: ${res?.level}\n说明: 5=临界 10=低 15=中 20=高`
    );
  };
  wx.onMemoryWarning(listener);
  wx.showToast({ title: '已注册 onMemoryWarning', icon: 'none' });
}

/** 停止监听 */
export function offMemoryWarning() {
  if (listener) {
    wx.offMemoryWarning(listener);
    listener = null;
    wx.showToast({ title: '已停止监听', icon: 'none' });
  }
}

export function onUnload() {
  offMemoryWarning();
}
