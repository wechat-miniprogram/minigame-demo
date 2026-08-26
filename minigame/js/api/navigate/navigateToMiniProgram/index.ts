/**
 * 跳转其他小程序 / 小游戏
 * wx.navigateToMiniProgram
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/navigate/wx.navigateToMiniProgram.html
 *
 * 注意：
 * 1) 需要在 mp 后台配置跳转白名单，否则会 fail。
 * 2) 此处的 DEMO_APPID 来自 minigame-api-test 用例，仅作演示，
 *    开发者请替换为自己已配置白名单的目标 AppID。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';


const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮跳转到指定小程序。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'navigateToMiniProgram';

const DEMO_APPID = 'wx7a727ff7d940bb3f';

/** 直接跳转 */
export function navigateToMiniProgram() {
  wx.navigateToMiniProgram({
    appId: DEMO_APPID,
    success(res: any) {
      console.log('[navigateToMiniProgram] success', res);
    },
    fail(err: any) {
      wx.showToast({ title: `${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 跳转并附带 path / envVersion / extraData */
export function navigateWithExtra() {
  wx.navigateToMiniProgram({
    appId: DEMO_APPID,
    path: '?test=123',
    envVersion: 'release',
    extraData: { from: 'minigame-demo', ts: Date.now() },
    success(res: any) {
      console.log('[navigateToMiniProgram] success', res);
    },
    fail(err: any) {
      wx.showToast({ title: `${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
