/**
 * 群任务 - 活动列表
 *
 * 涉及 API：
 * - wx.openChatTool / wx.isChatTool — 打开/判断聊天工具模式
 * - wx.cloud.callFunction('fetchActivityList') — 获取活动列表
 */

import { ActivityInfo } from '../shared/types';
import { openChatTool, showToast } from '../shared/util';

let activityList: ActivityInfo[] = [];

// ===== setter：UI 层绑定 =====
let _onListUpdate: ((list: ActivityInfo[]) => void) | null = null;
export function setOnListUpdate(fn: (list: ActivityInfo[]) => void) { _onListUpdate = fn; }

// ===== API 调用 =====

/** 获取活动列表 */
export function fetchActivityList() {
  wx.showLoading({ title: '加载中', mask: true });
  wx.cloud.callFunction({
    name: 'quickstartFunctions',
    data: { type: 'fetchActivityList' },
  }).then((resp: any) => {
    wx.hideLoading();
    if (resp.result) {
      activityList = resp.result.dataList || [];
      _onListUpdate?.(activityList);
    }
  }).catch((err: any) => {
    wx.hideLoading();
    console.error('fetchActivityList fail:', err);
    showToast('获取活动列表失败');
  });
}

/** 打开聊天工具后执行回调 */
export function openChatToolThen(callback: () => void, options?: { roomid?: string; chatType?: number }) {
  openChatTool({
    roomid: options?.roomid,
    chatType: options?.chatType,
    success() { callback(); },
    fail(err: any) { console.error('openChatTool fail:', err); },
  });
}

/** 清理状态 */
export function reset() {
  activityList = [];
  _onListUpdate = null;
}
