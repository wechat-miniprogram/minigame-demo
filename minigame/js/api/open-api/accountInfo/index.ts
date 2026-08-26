/**
 * 账号信息
 * wx.getAccountInfoSync
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/account-info/wx.getAccountInfoSync.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatJSON } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取当前账号信息，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'accountInfo';
/** 获取当前小游戏的账号信息 */
export function getAccountInfoSync() {
  const info: any = wx.getAccountInfoSync();
  setInfo(formatJSON(info));
}
