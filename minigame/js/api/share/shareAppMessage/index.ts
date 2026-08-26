/**
 * 主动分享
 * wx.shareAppMessage
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.shareAppMessage.html
 */

import { createInfoArea } from '../../../libs/info-area';

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击"分享给好友"按钮，将截取当前画布作为分享图片并拉起转发面板。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'shareAppMessage';

/** 主动拉起转发面板 */
export function shareToFriend() {
  let imageUrl = '';
  try {
    imageUrl = canvas.toTempFilePathSync({
      x: 0,
      y: 0,
      width: canvas.width,
      height: (canvas.width * 4) / 5,
    });
  } catch (e: any) {
    console.error('[shareAppMessage] toTempFilePathSync 失败', e);
    setInfo(`截图失败: ${e?.errMsg || e}`);
    return;
  }
  wx.shareAppMessage({
    title: '小游戏 API 示例',
    imageUrl,
  });
  setInfo('已拉起转发面板');
}
