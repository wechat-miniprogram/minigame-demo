/**
 * 重启当前小游戏
 * wx.restartMiniProgram
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/navigate/wx.restartMiniProgram.html
 *
 * 注意：调用后会立即重启小游戏，路径上的 query 可在重启后通过
 * wx.getLaunchOptionsSync() 读到，用于演示请配合「基础 > 生命周期」页面观察。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮重启当前小程序，操作结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'restartMiniProgram';

/** 直接重启（不带启动参数） */
export function restartMiniProgram() {
  wx.showToast({ title: '调用 wx.restartMiniProgram …', icon: 'none' });
  wx.restartMiniProgram({
    success(res: any) {
      console.log('[restartMiniProgram] success', res);
    },
    fail(err: any) {
      setInfo(`重启失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 重启并附带启动参数 query */
export function restartWithQuery() {
  wx.showToast({ title: '调用 wx.restartMiniProgram（带 path）…', icon: 'none' });
  setInfo('调用 wx.restartMiniProgram（带 path）…');
  wx.restartMiniProgram({
    path: '?from=demo&ts=' + Date.now(),
    success(res: any) {
      console.log('[restartMiniProgram] success', res);
    },
    fail(err: any) {
      setInfo(`重启失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
