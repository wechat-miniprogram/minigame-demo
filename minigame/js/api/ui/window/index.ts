/**
 * 窗口
 * wx.onWindowResize / wx.offWindowResize
 * wx.onWindowStateChange / wx.offWindowStateChange
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/window/wx.onWindowResize.html
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/window/wx.setWindowSize.html
 *
 * 注意：窗口相关 API 仅在 PC 端有效，移动端无意义。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮监听窗口尺寸/状态变化，事件信息将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'window';
let resizeListener: any = null;
let stateListener: any = null;

/** 检测是否为 PC 端（含开发者工具），非 PC 则提示并返回 false */
function isPC(): boolean {
  const { platform } = wx.getDeviceInfo();
  if (platform !== 'windows' && platform !== 'mac') {
    wx.showToast({ title: '该功能仅支持 PC 端', icon: 'none', duration: 1000 });
    return false;
  }
  return true;
}

/** 监听窗口尺寸变化（横竖屏切换、PC 端拖拽窗口） */
export function onWindowResize() {
  if (!isPC()) return;
  if (resizeListener) {
    wx.showToast({ title: '已在监听，请先取消', icon: 'none', duration: 1000 });
    return;
  }
  resizeListener = (res: any) => {
    setInfo(
      formatObj({
        事件: 'resize',
        windowWidth: String(res.windowWidth),
        windowHeight: String(res.windowHeight),
      })
    );
  };
  wx.onWindowResize(resizeListener);
  setInfo('已注册 resize 监听，请拖拽窗口边缘观察');
}

/** 取消监听窗口尺寸变化 */
export function offWindowResize() {
  if (!isPC()) return;
  if (resizeListener) {
    wx.offWindowResize(resizeListener);
    resizeListener = null;
    wx.showToast({ title: '已取消 resize 监听', icon: 'none', duration: 1000 });
  } else {
    wx.showToast({ title: '当前无监听，无需取消', icon: 'none', duration: 1000 });
  }
}

/** 监听窗口状态变化（最大化/还原/最小化） */
export function onWindowStateChange() {
  if (!isPC()) return;
  if (typeof wx.onWindowStateChange !== 'function') {
    wx.showToast({ title: '当前版本不支持 onWindowStateChange', icon: 'none', duration: 1000 });
    return;
  }
  stateListener = (res: any) => {
    setInfo(
      formatObj({
        事件: 'stateChange',
        state: res.state || '-',
      })
    );
  };
  wx.onWindowStateChange(stateListener);
  wx.showToast({ title: '已注册 windowState 监听', icon: 'none', duration: 1000 });
}

/** 取消监听窗口状态变化 */
export function offWindowStateChange() {
  if (!isPC()) return;
  if (stateListener) {
    wx.offWindowStateChange?.(stateListener);
    stateListener = null;
    wx.showToast({ title: '已取消 windowState 监听', icon: 'none', duration: 1000 });
  } else {
    wx.showToast({ title: '当前无监听，无需取消', icon: 'none', duration: 1000 });
  }
}

export function onUnload() {
  if (resizeListener) {
    wx.offWindowResize(resizeListener);
    resizeListener = null;
  }
  if (stateListener) {
    wx.offWindowStateChange?.(stateListener);
    stateListener = null;
  }
}
