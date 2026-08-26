/**
 * 群相关
 * wx.getGroupEnterInfo
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/group/wx.getGroupEnterInfo.html
 *
 * 完整流程（分享+回流检测逻辑见 libs/group-share.ts）：
 *   1. 点击「分享到群」按钮 → 分享到微信群
 *   2. 群友点击会话卡片重新打开小游戏（携带 shareTicket）
 *   3. onShow / 启动参数检测到 shareTicket → 自动调用 getGroupEnterInfo
 *   4. 结果展示到按钮上方常驻信息区
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatJSON } from '../../../libs/format';
import { createGroupShareFlow } from '../../../libs/group-share';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击「分享到群」按钮，\n然后从群聊点击会话卡片进入，\n将自动获取群进群信息'
);
export { onInfoTextReady, infoArea };
export const apiName = 'group';
// 群分享回流流程（shareToGroup / onLoad / onUnload 委托给它）
const flow = createGroupShareFlow({
  onStatus: (msg) => setInfo(msg),
  onResult: (info) => setInfo(formatJSON(info)),
  onError: (errMsg) => setInfo(`获取失败: ${errMsg}`),
});

/** 分享到群（引导用户从群聊进入） */
export function shareToGroup() {
  flow.shareToGroup();
}

/** 手动获取群进群信息（兜底，直接调用 wx API） */
export function getGroupEnterInfo() {
  wx.getGroupEnterInfo({
    success(res: any) {
      setInfo(formatJSON(res));
    },
    fail(err: any) {
      setInfo(`查询失败: ${err?.errMsg || '请从群聊场景进入'}`);
    },
  });
}

export function onLoad() {
  flow.onLoad();
}

export function onUnload() {
  flow.onUnload(); 
}
