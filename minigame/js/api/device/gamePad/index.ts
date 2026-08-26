/**
 * 手柄
 * wx.onGamepadConnected / wx.offGamepadConnected /
 * wx.onGamepadDisconnected / wx.offGamepadDisconnected
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/gamepad/wx.onGamepadConnected.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮监听手柄连接与按键事件，手柄数据将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'gamePad';
let connectListener: any = null;
let disconnectListener: any = null;

/** 监听手柄连接/断开 */
export function listenGamepad() {
  if (connectListener) {
    wx.showToast({ title: '已在监听', icon: 'none' });
    return;
  }
  connectListener = (res: any) => {
    setInfo(`事件: connected\nid: ${res?.id}\nmapping: ${res?.mapping}`);
  };
  disconnectListener = (res: any) => {
    setInfo(`事件: disconnected\nid: ${res?.id}`);
  };
  wx.onGamepadConnected(connectListener);
  wx.onGamepadDisconnected(disconnectListener);
  wx.showToast({ title: '已注册手柄监听，请插拔手柄', icon: 'none' });
}

/** 停止监听 */
export function stopListen() {
  if (connectListener) (wx as any).offGamepadConnected(connectListener);
  if (disconnectListener)
    (wx as any).offGamepadDisconnected(disconnectListener);
  connectListener = disconnectListener = null;
  wx.showToast({ title: '已停止手柄监听', icon: 'none' });
}

export function onUnload() {
  stopListen();
}
