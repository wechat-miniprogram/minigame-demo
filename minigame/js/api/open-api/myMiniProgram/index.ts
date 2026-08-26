/**
 * 我的小程序
 * wx.checkIsAddedToMyMiniProgram
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/my-miniprogram/wx.checkIsAddedToMyMiniProgram.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮查询或添加「我的小程序」。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'myMiniProgram';
/** 检查是否添加到我的小程序 */
export function checkIsAddedToMyMiniProgram() {
  wx.checkIsAddedToMyMiniProgram({
    success(res: any) {
      wx.showToast({ title: `是否已添加: ${res.added ? '是' : '否'}`, icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `查询失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  } as any);
}
