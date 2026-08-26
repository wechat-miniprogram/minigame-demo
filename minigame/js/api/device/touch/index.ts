/**
 * 触摸事件
 * wx.onTouchStart / wx.offTouchStart / wx.onTouchMove / wx.offTouchMove /
 * wx.onTouchEnd / wx.offTouchEnd / wx.onTouchCancel / wx.offTouchCancel
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/touch-event/wx.onTouchStart.html
 *
 * 注意：全局触摸监听会拦截 UI 交互，因此 5 秒后自动停止监听。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮开始/停止触摸监听，触摸事件将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'touch';
const listeners: Record<string, any> = {};
let autoStopTimer: ReturnType<typeof setTimeout> | null = null;

/** 监听所有触摸事件（5秒后自动停止，避免拦截UI交互） */
export function listenAll() {
  if (listeners.start) {
    setInfo('已在监听');
    return;
  }
  listeners.start = (res: any) => {
    const t = res.touches?.[0];
    setInfo(
      `事件: touchstart\nx: ${t?.clientX}\ny: ${t?.clientY}\n触点数: ${res.touches?.length || 0}`
    );
  };
  listeners.end = (res: any) =>
    setInfo(
      `事件: touchend\nchangedTouches: ${res.changedTouches?.length || 0}`
    );
  listeners.cancel = () => setInfo('事件: touchcancel\n说明: 被打断');

  // touchmove 仅记录到变量，不频繁刷新 display，避免阻塞 UI
  let lastMoveInfo = '';
  listeners.move = (res: any) => {
    const t = res.touches?.[0];
    lastMoveInfo = `x: ${t?.clientX}, y: ${t?.clientY}`;
  };

  wx.onTouchStart(listeners.start);
  wx.onTouchMove(listeners.move);
  wx.onTouchEnd(listeners.end);
  wx.onTouchCancel(listeners.cancel);
  setInfo('已注册触摸事件，5秒后自动停止\n请在屏幕上触摸');

  // 5秒后自动停止监听，恢复 UI 交互
  autoStopTimer = setTimeout(() => {
    stopAll();
    setInfo(
      `触摸监听已自动停止\n最后一次 touchmove: ${lastMoveInfo || '无'}`
    );
  }, 5000);
}

/** 停止所有触摸监听 */
export function stopAll() {
  if (autoStopTimer) {
    clearTimeout(autoStopTimer);
    autoStopTimer = null;
  }
  if (listeners.start) wx.offTouchStart(listeners.start);
  if (listeners.move) wx.offTouchMove(listeners.move);
  if (listeners.end) wx.offTouchEnd(listeners.end);
  if (listeners.cancel) wx.offTouchCancel(listeners.cancel);
  Object.keys(listeners).forEach((k) => delete listeners[k]);
  setInfo('已停止触摸监听');
}

export function onUnload() {
  stopAll();
}
