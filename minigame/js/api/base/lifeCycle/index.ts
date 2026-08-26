/**
 * 小游戏生命周期
 * wx.onShow / wx.offShow / wx.onHide / wx.offHide /
 * wx.getLaunchOptionsSync / wx.getEnterOptionsSync
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/app/life-cycle/wx.onShow.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatJSON } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

// ============== 信息展示区 ==============

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '监听小游戏展示事件：\n小游戏回到前台后会触发此事件\n监听小游戏隐藏到后台事件：\n锁屏、按 HOME 键退到桌面、显示在聊天顶部等操作会触发此事件。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'lifeCycle';
// ============== 生命周期监听 ==============

let showListener: ((res: any) => void) | null = null;
let hideListener: (() => void) | null = null;

/** 监听小游戏回到前台 */
export function onShow() {
  if (showListener) {
    wx.showToast({ title: '已在监听 onShow，请先停止', icon: 'none' });
    return;
  }
  showListener = (res: any) => {
    setInfo(formatJSON(res));
  };
  wx.onShow(showListener);
  setInfo('已注册 onShow，切到后台再回来观察');
}

/** 停止监听 onShow */
export function offShow() {
  if (showListener) {
    wx.offShow(showListener);
    showListener = null;
    wx.showToast({ title: '已停止 onShow 监听', icon: 'none' });
  }
}

/** 监听小游戏进入后台 */
export function onHide() {
  if (hideListener) {
    wx.showToast({ title: '已在监听 onHide，请先停止', icon: 'none' });
    return;
  }
  hideListener = () => {
    setInfo('onHide 已触发 — 小游戏进入后台');
  };
  wx.onHide(hideListener);
  setInfo('已注册 onHide，切到后台再回来观察');
}

/** 停止监听 onHide */
export function offHide() {
  if (hideListener) {
    wx.offHide(hideListener);
    hideListener = null;
    wx.showToast({ title: '已停止 onHide 监听', icon: 'none' });
  }
}

/** 获取冷启动参数 */
export function getLaunchOptionsSync() {
  setInfo(formatJSON(wx.getLaunchOptionsSync()));
}

/** 获取启动参数（冷启动和热启动均可） */
export function getEnterOptionsSync() {
  setInfo(formatJSON(wx.getEnterOptionsSync()));
}

export function onUnload() {
  offShow();
  offHide();
}
