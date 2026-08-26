/**
 * 分享图片菜单
 * wx.showShareImageMenu
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/share/wx.showShareImageMenu.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮截取画布并弹出图片分享菜单。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'showShareImageMenu';

/** 截取当前画布作为分享图片，调起图片分享菜单 */
export function showShareImageMenu() {
  wx.showToast({ title: '截取画布中...', icon: 'none' });
  try {
    const tempFilePath = canvas.toTempFilePathSync({
      x: 0,
      y: 0,
      width: canvas.width,
      height: (canvas.width * 4) / 5,
    });
    wx.showShareImageMenu({
      path: tempFilePath,
      success() {
        wx.showToast({ title: '已弹出图片分享菜单', icon: 'none' });
      },
      fail(err: any) {
        wx.showToast({ title: `${err?.errMsg || '未知错误'}`, icon: 'none' });
      },
    });
  } catch (e: any) {
    wx.showToast({ title: `截图失败：${e.message || e}`, icon: 'none' });
  }
}
