/**
 * 订阅消息
 * wx.requestSubscribeMessage / wx.requestSubscribeSystemMessage
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/subscribe-message/wx.requestSubscribeSystemMessage.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮发起订阅消息授权。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'requestSubscribeMessage';

/** 请求一次性订阅消息 */
export function requestSubscribeMessage() {
  const tmplIds = ['wAniOv_NUi6TXiQWX74_1LD5E4_6EfqvaeSxUxhqllg'];
  wx.requestSubscribeMessage({
    tmplIds,
    success(res: any) {
      if (res[tmplIds[0]] === 'accept') {
        // 用户允许订阅，调用云函数推送消息
        wx.cloud.callFunction({
          name: 'pushMessage',
          data: {
            page: `pathName=${window.router.getNowPageName()}`,
          },
          success() {
            wx.showToast({ title: '推送成功', icon: 'success' });
          },
          fail(err2: any) {
            wx.showToast({ title: `推送失败: ${err2?.errMsg || '未知错误'}`, icon: 'none' });
          },
        });
      } else if (res[tmplIds[0]] === 'reject') {
        wx.showToast({ title: '你已拒绝消息订阅，可在设置中打开', icon: 'none' });
      }
    },
    fail() {
      wx.showToast({ title: '你已拒绝消息订阅，可在设置中打开', icon: 'none' });
    },
  });
}

/** 请求永久订阅系统消息（好友互动提醒 / 排行榜超越提醒） */
export function requestSubscribeSystemMessage() {
  wx.requestSubscribeSystemMessage({
    msgTypeList: ['SYS_MSG_TYPE_INTERACTIVE', 'SYS_MSG_TYPE_RANK'],
    success(res: any) {
      let tips = '永久订阅成功: ';
      if (res.SYS_MSG_TYPE_INTERACTIVE === 'accept') {
        tips += '好友互动提醒';
      }
      if (res.SYS_MSG_TYPE_RANK === 'accept') {
        if (tips !== '永久订阅成功: ') tips += '、';
        tips += '排行榜好友超越提醒';
      }
      wx.showToast({ title: tips, icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `永久订阅失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
