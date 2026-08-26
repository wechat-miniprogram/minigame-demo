/**
 * 监听网络状态变化
 * wx.onNetworkStatusChange / wx.offNetworkStatusChange
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮监听网络状态变化，网络切换信息将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'onNetworkStatusChange';
let listener: any = null;

/** 开始监听网络状态变化 */
export function startListening() {
  if (listener) {
    setInfo('已在监听');
    return;
  }
  listener = (res: any) => {
    setInfo(
      `连接状态: ${res.isConnected ? '已连接' : '已断开'}\n网络类型: ${res.networkType}`
    );
  };
  wx.onNetworkStatusChange(listener);
  setInfo('已开始监听（请切换网络以查看变化）');
}

/** 停止监听 */
export function stopListening() {
  if (listener) {
    wx.offNetworkStatusChange(listener);
    listener = null;
    setInfo('已停止监听');
  }
}

export function onUnload() {
  if (listener) {
    wx.offNetworkStatusChange(listener);
    listener = null;
  }
}
