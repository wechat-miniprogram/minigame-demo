/**
 * 鼠标滚轮（PC 端）
 * wx.onWheel / wx.offWheel
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/wheel-event/wx.onWheel.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮监听滚轮事件，滚轮数据将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'wheel';
let wheelListener: any = null;
let count = 0;

/** 监听滚轮事件 */
export function onWheel() {
  // 判断是否 PC 环境
  const systemInfo = wx.getSystemInfoSync();
  const platform = (systemInfo.platform || '').toLowerCase();
  if (platform !== 'windows' && platform !== 'mac' && platform !== 'devtools') {
    wx.showToast({ title: '请在 PC 环境下使用滚轮事件', icon: 'none' });
    return;
  }
  if (wheelListener) {
    wx.showToast({ title: '已在监听', icon: 'none' });
    return;
  }
  count = 0;
  wheelListener = (res: any) => {
    count += 1;
    setInfo(
      `触发次数: ${count}\ndeltaX: ${res?.deltaX}\ndeltaY: ${res?.deltaY}\ndeltaZ: ${res?.deltaZ}`
    );
  };
  wx.onWheel(wheelListener);
  wx.showToast({ title: '已注册滚轮监听', icon: 'none' });
}

/** 停止监听 */
export function offWheel() {
  if (wheelListener) {
    wx.offWheel(wheelListener);
    wheelListener = null;
    wx.showToast({ title: '已停止滚轮监听', icon: 'none' });
  }
}

export function onUnload() {
  offWheel();
}
