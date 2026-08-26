/**
 * 鼠标事件（PC 端）
 * wx.onMouseDown / wx.offMouseDown / wx.onMouseUp / wx.offMouseUp /
 * wx.onMouseMove / wx.offMouseMove
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/mouse-event/wx.onMouseDown.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮监听鼠标事件（移动/按下/滚轮），事件数据将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'mouse';
let downListener: any = null;
let upListener: any = null;
let moveListener: any = null;
let lastMoveAt = 0;

/** 监听所有鼠标事件 */
export function listenAll() {
  // 判断是否 PC 环境
  const systemInfo = wx.getSystemInfoSync();
  const platform = (systemInfo.platform || '').toLowerCase();
  if (platform !== 'windows' && platform !== 'mac' && platform !== 'devtools') {
    wx.showToast({ title: '请在 PC 环境下使用鼠标事件', icon: 'none' });
    return;
  }
  if (downListener) {
    wx.showToast({ title: '已在监听', icon: 'none' });
    return;
  }
  downListener = (res: any) =>
    setInfo(
      `事件: mousedown\n按键: ${res?.button}\nx: ${res?.x}\ny: ${res?.y}`
    );
  upListener = (res: any) =>
    setInfo(
      `事件: mouseup\n按键: ${res?.button}\nx: ${res?.x}\ny: ${res?.y}`
    );
  moveListener = (res: any) => {
    const now = Date.now();
    if (now - lastMoveAt < 100) return; // 节流
    lastMoveAt = now;
    setInfo(`事件: mousemove\nx: ${res?.x}\ny: ${res?.y}`);
  };
  wx.onMouseDown(downListener);
  wx.onMouseUp(upListener);
  wx.onMouseMove(moveListener);
  wx.showToast({ title: '已注册鼠标监听，请移动/点击鼠标', icon: 'none' });
}

/** 停止所有鼠标监听 */
export function stopAll() {
  if (downListener) wx.offMouseDown(downListener);
  if (upListener) wx.offMouseUp(upListener);
  if (moveListener) wx.offMouseMove(moveListener);
  downListener = upListener = moveListener = null;
  wx.showToast({ title: '已停止所有鼠标监听', icon: 'none' });
}

export function onUnload() {
  stopAll();
}
