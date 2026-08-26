/**
 * 意见反馈
 * wx.createFeedbackButton
 * FeedbackButton.destroy / FeedbackButton.hide / FeedbackButton.offTap /
 * FeedbackButton.onTap / FeedbackButton.show
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/customer-message/wx.openCustomerServiceConversation.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮创建/销毁客服消息反馈按钮。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'customerMessage';
let feedbackButton: any = null;

/** 创建意见反馈按钮 (FeedbackButton) */
export function createFeedbackButton() {
  if (feedbackButton) {
    wx.showToast({ title: '已存在反馈按钮，请先销毁', icon: 'none' });
    return;
  }
  const sysInfo = wx.getSystemInfoSync();
  const windowWidth = sysInfo?.windowWidth || 375;
  const windowHeight = sysInfo?.windowHeight || 667;
  feedbackButton = wx.createFeedbackButton({
    type: 'text',
    text: '意见反馈',
    style: {
      left: windowWidth / 2 - 100,
      top: 550,
      width: 200,
      height: 40,
      backgroundColor: '#ffffff',
      color: '#07c160',
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 40,
    },
  });

  if (!feedbackButton) {
    wx.showToast({ title: '创建反馈按钮失败', icon: 'none' });
    return;
  }

  feedbackButton.onTap?.(() => {
    wx.showToast({ title: 'onTap 回调触发', icon: 'none' });
  });
  feedbackButton.show?.();
  wx.showToast({ title: '反馈按钮已创建并显示', icon: 'none' });
}

/** FeedbackButton.show - 显示按钮 */
export function show() {
  if (!feedbackButton) {
    wx.showToast({ title: '请先创建反馈按钮', icon: 'none' });
    return;
  }
  feedbackButton.show?.();
  wx.showToast({ title: '反馈按钮已显示', icon: 'none' });
}

/** FeedbackButton.hide - 隐藏按钮 */
export function hide() {
  if (!feedbackButton) {
    wx.showToast({ title: '请先创建反馈按钮', icon: 'none' });
    return;
  }
  feedbackButton.hide?.();
  wx.showToast({ title: '反馈按钮已隐藏', icon: 'none' });
}

/** FeedbackButton.onTap - 监听点击事件 */
export function onTap() {
  if (!feedbackButton) {
    wx.showToast({ title: '请先创建反馈按钮', icon: 'none' });
    return;
  }
  feedbackButton.onTap?.(() => {
    wx.showToast({ title: '已注册 onTap 监听', icon: 'none' });
  });
  wx.showToast({ title: 'onTap 监听已绑定', icon: 'none' });
}

/** FeedbackButton.offTap - 取消监听点击事件 */
export function offTap() {
  if (!feedbackButton) {
    wx.showToast({ title: '请先创建反馈按钮', icon: 'none' });
    return;
  }
  feedbackButton.offTap?.();
  wx.showToast({ title: 'offTap 已取消监听', icon: 'none' });
}

/** FeedbackButton.destroy - 销毁按钮 */
export function destroy() {
  if (feedbackButton) {
    feedbackButton.destroy?.();
    feedbackButton = null;
    wx.showToast({ title: '反馈按钮已销毁', icon: 'none' });
  } else {
    wx.showToast({ title: '无反馈按钮可销毁', icon: 'none' });
  }
}

export function onUnload() {
  if (feedbackButton) {
    feedbackButton.destroy?.();
    feedbackButton = null;
  }
}
