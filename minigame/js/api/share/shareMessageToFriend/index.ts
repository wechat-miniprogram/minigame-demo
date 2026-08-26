/**
 * 分享到好友
 * wx.onShareMessageToFriend / wx.offShareMessageToFriend / wx.setMessageToFriendQuery
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮发起分享给好友。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'shareMessageToFriend';
function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

let shareMsgFn: any = null;

/** 设置 query 并立即触发分享 */
export function setAndShare() {
  wx.shareAppMessage({
    title: '测试转发',
    imageUrl: '',
  });
  toast('已 setQuery + shareAppMessage');
}

/** 监听分享到好友消息 */
export function onShareMessageToFriend() {
  shareMsgFn = (res: any) => {
    toast(
      `onShareMessageToFriend | scene: ${res.shareMessageToFriendScene ?? '-'}`,
    );
  };
  wx.onShareMessageToFriend(shareMsgFn);
  toast('已监听分享到好友事件');
}

/** 取消监听分享到好友 */
export function offShareMessageToFriend() {
  if (shareMsgFn) {
    wx.offShareMessageToFriend(shareMsgFn);
    shareMsgFn = null;
    toast('已取消监听分享到好友');
  } else {
    toast('当前无监听，无需取消');
  }
}

export function onUnload() {
  if (shareMsgFn) {
    wx.offShareMessageToFriend(shareMsgFn);
    shareMsgFn = null;
  }
}
