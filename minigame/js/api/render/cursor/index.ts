/**
 * 光标 / 指针锁定（仅 PC 端）
 * wx.setCursor / wx.requestPointerLock / wx.isPointerLocked / wx.exitPointerLock
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮显示/隐藏鼠标指针。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'cursor';
function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

function isPC(): boolean {
  try {
    const { platform } = wx.getSystemInfoSync();
    return (
      platform === 'windows' || platform === 'mac' || platform === 'devtools'
    );
  } catch {
    return false;
  }
}

function checkPC(): boolean {
  if (!isPC()) {
    const { platform } = wx.getSystemInfoSync();
    toast(`该功能仅支持 PC 端，当前环境为 ${platform}`);
    return false;
  }
  return true;
}

/** 设置鼠标光标样式（PC 端） */
export function setCursorDefault() {
  if (!checkPC()) return;
  (wx as any).setCursor('default');
  toast('已设为 default');
}

/** 设置为手型 */
export function setCursorPointer() {
  if (!checkPC()) return;
  (wx as any).setCursor('pointer');
  toast('已设为 pointer');
}

/** 请求指针锁定（FPS 游戏常用） */
export function requestPointerLock() {
  if (!checkPC()) return;
  (wx as any).requestPointerLock();
  toast('指针锁定已请求');
}

/** 查询是否锁定 */
export function isPointerLocked() {
  if (!checkPC()) return;
  const locked = (wx as any).isPointerLocked?.() ?? false;
  toast(`isPointerLocked: ${locked}`);
}

/** 退出锁定 */
export function exitPointerLock() {
  if (!checkPC()) return;
  (wx as any).exitPointerLock();
  toast('已退出指针锁定');
}
