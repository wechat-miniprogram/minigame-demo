/**
 * 转发
 * wx.onShareAppMessage / wx.offShareAppMessage / wx.showShareMenu
 */

import { createInfoArea } from '../../../libs/info-area';

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击"开启被动转发"后，可通过右上角菜单或系统分享触发转发。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'onShareAppMessage';
let transpondFn: any = null;

/** 开启被动转发监听 */
export function enableShare() {
  wx.showShareMenu({ withShareTicket: true });

  transpondFn = () => {
    let imageUrl = '';
    try {
      imageUrl = canvas.toTempFilePathSync({
        x: 0,
        y: 0,
        width: canvas.width,
        height: (canvas.width * 4) / 5,
      });
    } catch (e: any) {
      console.error('[onShareAppMessage] toTempFilePathSync 失败', e);
    }
    return {
      title: '小游戏 API 示例',
      imageUrl,
      query: `pathName=${window.router.getNowPageName()}`,
    };
  };
  wx.onShareAppMessage(transpondFn);
  setInfo('已开启被动转发监听，可通过右上角菜单触发分享');
}

/** 关闭转发 */
export function disableShare() {
  if (transpondFn) {
    wx.offShareAppMessage(transpondFn);
    transpondFn = null;
    setInfo('已关闭被动转发监听');
  }
}

export function onUnload() {
  if (transpondFn) {
    wx.offShareAppMessage(transpondFn);
    transpondFn = null;
  }
}
