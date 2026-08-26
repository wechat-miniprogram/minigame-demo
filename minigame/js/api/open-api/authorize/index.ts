/**
 * 用户授权
 * wx.authorize / wx.getSetting
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/authorize/wx.authorize.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatJSON } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮发起授权或获取授权状态，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'authorize';
/** 请求写相册授权，已授权则直接调用保存 */
export function authorizeWritePhotosAlbum() {
  wx.getSetting({
    success(res: any) {
      if (res.authSetting['scope.writePhotosAlbum']) {
        wx.showToast({ title: '已有相册权限，可直接保存', icon: 'none' });
      } else {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            wx.showToast({ title: '相册授权成功', icon: 'none' });
          },
          fail(err: any) {
            setInfo(formatJSON(err));
          },
        });
      }
    },
    fail(err: any) {
      setInfo(formatJSON(err));
    },
  });
}
