/**
 * 获取群进群信息
 * wx.getGroupEnterInfo
 *
 * 完整流程（分享+回流检测逻辑见 libs/group-share.ts）：
 *   1. 点击「分享到群」按钮 → 分享到微信群
 *   2. 群友点击会话卡片重新打开小游戏（携带 shareTicket）
 *   3. onShow / 启动参数检测到 shareTicket → 自动调用 getGroupEnterInfo
 *
 * 注意：getShareInfo 已废弃，请使用 getGroupEnterInfo 替代。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { createGroupShareFlow } from '../../../libs/group-share';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取转发详情信息（群分享 ticket 等）。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'getShareInfo';

function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

// 群分享回流流程
const flow = createGroupShareFlow({
  onStatus: (msg) => toast(msg),
  onResult: (info) => toast(`获取成功 | errMsg: ${info.errMsg || ''}`),
  onError: (errMsg) => toast(`获取失败: ${errMsg}`),
});

/** 分享到群 */
export function shareToGroup() {
  flow.shareToGroup();
}

export function onLoad() {
  flow.onLoad();
}

export function onUnload() {
  flow.onUnload();
}
