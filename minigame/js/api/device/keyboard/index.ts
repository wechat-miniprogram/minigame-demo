/**
 * 键盘
 * wx.showKeyboard / wx.hideKeyboard / wx.updateKeyboard /
 * wx.onKeyboardInput / wx.offKeyboardInput /
 * wx.onKeyboardConfirm / wx.offKeyboardConfirm /
 * wx.onKeyboardComplete / wx.offKeyboardComplete /
 * wx.onKeyboardHeightChange / wx.offKeyboardHeightChange /
 * wx.onKeyDown / wx.offKeyDown / wx.onKeyUp / wx.offKeyUp
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/keyboard/wx.showKeyboard.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮显示/隐藏键盘，输入内容通过回调获取。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'keyboard';
const listeners: Record<string, any> = {};

/** 显示软键盘 */
export function showKeyboard() {
  wx.showKeyboard({
    defaultValue: '',
    maxLength: 20,
    multiple: false,
    confirmHold: false,
    confirmType: 'done',
    keyboardType: 'default',
    success() {
    },
    fail(err: any) {
      wx.showToast({ title: `弹出键盘失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  } as any);
}

/** 隐藏软键盘 */
export function hideKeyboard() {
  wx.hideKeyboard({
    success() {
      wx.showToast({ title: '软键盘已隐藏', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `隐藏键盘失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 更新软键盘默认值 */
export function updateKeyboard() {
  wx.updateKeyboard({
    value: '更新-' + Date.now(),
    success() {
      wx.showToast({ title: '已更新软键盘内容', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `更新键盘失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 监听键盘输入 + 确认 + 完成 + 高度变化 */
export function listenSoftKeyboard() {
  listeners.input = (res: any) => wx.showToast({ title: `input: ${res.value}`, icon: 'none' });
  listeners.confirm = (res: any) =>
    wx.showToast({ title: `confirm: ${res.value}`, icon: 'none' });
  listeners.complete = (res: any) =>
    wx.showToast({ title: `complete: ${res.value}`, icon: 'none' });
  listeners.height = (res: any) =>
    wx.showToast({ title: `heightChange: ${res.height}`, icon: 'none' });

  wx.onKeyboardInput(listeners.input);
  wx.onKeyboardConfirm(listeners.confirm);
  wx.onKeyboardComplete(listeners.complete);
  wx.onKeyboardHeightChange(listeners.height);
  wx.showToast({ title: '已注册软键盘 4 个事件', icon: 'none' });
}

/** 停止软键盘监听 */
export function stopSoftKeyboard() {
  if (listeners.input) wx.offKeyboardInput(listeners.input);
  if (listeners.confirm) wx.offKeyboardConfirm(listeners.confirm);
  if (listeners.complete) wx.offKeyboardComplete(listeners.complete);
  if (listeners.height) wx.offKeyboardHeightChange(listeners.height);
  ['input', 'confirm', 'complete', 'height'].forEach(
    (k) => delete listeners[k]
  );
  wx.showToast({ title: '已停止软键盘监听', icon: 'none' });
}

/** 监听物理键盘按键（PC 端） */
export function listenHardKeyboard() {
  // 判断是否 PC 环境
  const systemInfo = wx.getSystemInfoSync();
  const platform = (systemInfo.platform || '').toLowerCase();
  if (platform !== 'windows' && platform !== 'mac' && platform !== 'devtools') {
    wx.showToast({ title: '请在 PC 环境下使用物理键盘事件', icon: 'none' });
    return;
  }
  listeners.keydown = (res: any) =>
    wx.showToast({ title: `keydown: ${res.key} (${res.code})`, icon: 'none' });
  listeners.keyup = (res: any) =>
    wx.showToast({ title: `keyup: ${res.key} (${res.code})`, icon: 'none' });
  wx.onKeyDown(listeners.keydown);
  wx.onKeyUp(listeners.keyup);
  wx.showToast({ title: '已注册物理键盘监听', icon: 'none' });
}

/** 停止物理键盘监听 */
export function stopHardKeyboard() {
  if (listeners.keydown) wx.offKeyDown(listeners.keydown);
  if (listeners.keyup) wx.offKeyUp(listeners.keyup);
  delete listeners.keydown;
  delete listeners.keyup;
  wx.showToast({ title: '已停止物理键盘监听', icon: 'none' });
}

export function onUnload() {
  stopSoftKeyboard();
  stopHardKeyboard();
}
