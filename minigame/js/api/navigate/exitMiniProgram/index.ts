/**
 * 退出当前小游戏
 * wx.exitMiniProgram
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/navigate/wx.exitMiniProgram.html
 *
 * 注意：调用后会直接退出小游戏，返回到微信主界面。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮退出当前小程序，操作结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'exitMiniProgram';

/** 退出小游戏 */
export function exitMiniProgram() {
  wx.exitMiniProgram({
    success(res: any) {
      console.log('[exitMiniProgram] success', res);
    },
    fail(err: any) {
      setInfo(`退出失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
