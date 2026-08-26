/**
 * 开放数据域（主域侧）
 *
 * 主域通过 wx.getOpenDataContext().postMessage() 向子域发送消息，
 * 子域通过 wx.onMessage 监听并渲染到 sharedCanvas。
 * 主域需要将 sharedCanvas 绘制到 PIXI 舞台上才能看到子域内容，
 * 该部分由 libs/rich-configs/openDataContext.ts 的 buildTopView 负责（每帧刷纹理）。
 *
 * 与 demo2 abilityOpen/openDataContext 对齐的功能：
 *   setUserRecord          - 上报随机分数
 *   showFriendRank         - 显示好友排行榜（子域渲染到 sharedCanvas）
 *   showFriendsOnlineStatus - 显示好友在线状态（子域渲染到 sharedCanvas）
 *   shareGroupRank         - 分享到群，群内点开后回流触发群排行榜
 *   closeCanvas            - 关闭开放数据域画布
 *   subscribeSystemMessage - 订阅系统消息（好友互动 / 排行榜超越提醒）
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮上报分数或查看好友排行榜，排行榜将在弹出的卡片中展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'openDataContext';
function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

/** 判断当前是否为 PC 端 */
function isPCPlatform(): boolean {
  const { platform } = wx.getSystemInfoSync();
  const p = (platform || '').toLowerCase();
  return p === 'windows' || p === 'mac' || p === 'devtools';
}

/** 排行榜使用的托管数据 key，需与子域 data.ts 保持一致 */
const RANK_KEY = 'rankid';

let onShowFn: ((res: any) => void) | null = null;

// ============== PC 接力 ==============

/** 设置接力 query 参数（游戏域同步 API，返回 Boolean） */
export function setHandoffQuery() {
  if (isPCPlatform()) {
    toast('当前处于 PC 端，不支持 PC 接力');
    return;
  }
  const query = 'from=demo';
  const ok = (wx as any).setHandoffQuery(query);
  toast(`query: ${query} | 设置结果: ${ok ? '成功' : '失败'}`);
}

/**
 * 展示 PC 接力面板。
 *
 * 向子域发送 PCHandoff 消息，子域会在 sharedCanvas 上渲染：
 *   1. "查询是否支持接力" 按钮 → 点击调用 wx.checkHandoffEnabled（子域 API）
 *   2. 若支持则显示 "在电脑上打开" 按钮 → 点击调用 wx.startHandoff（子域 API）
 */
export function showPCHandoff() {
  if (isPCPlatform()) {
    toast('当前处于 PC 端，PC 接力查询不可用');
    return;
  }
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'PCHandoff',
    });
  } catch (e: any) {
    toast(`发送失败: ${e.message}`);
  }
}

// ============== 排行榜 / 好友 ==============

/** 上报随机分数（主域直接调用 setUserCloudStorage，与子域使用同一个 key） */
export function setUserRecord() {
  const score = Math.floor(Math.random() * 1000 + 1);
  wx.setUserCloudStorage({
    KVDataList: [
      {
        key: RANK_KEY,
        value: JSON.stringify({
          wxgame: {
            score,
            update_time: Math.floor(Date.now() / 1000),
          },
        }),
      },
    ],
    success() {
      toast(`分数上报成功: ${score}分`);
    },
    fail(err: any) {
      toast(`上报失败: ${err?.errMsg || ''}`);
    },
  });
}

/** 显示好友排行榜（子域会渲染 UI 到 sharedCanvas） */
export function showFriendRank() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'showFriendRank',
    });
  } catch (e: any) {
    toast(`发送失败: ${e.message}`);
  }
}

/** 显示好友在线状态（子域会渲染 UI 到 sharedCanvas） */
export function showFriendsOnlineStatus() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'showFriendsOnlineStatus',
    });
  } catch (e: any) {
    toast(`发送失败: ${e.message}`);
  }
}

/**
 * 分享到群，群内成员点击会话卡片重新打开小游戏时，
 * 通过 onShow 携带的 shareTicket 触发群排行榜（见 onLoad 的回流检测）。
 */
export function shareGroupRank() {
  try {
    wx.shareAppMessage({
      title: '高手如云，看看群里你排第几',
      query: 'showGroup=1&pathName=openDataContext',
      imageUrl: canvas.toTempFilePathSync({
        x: 0,
        y: 0,
        width: canvas.width,
        height: (canvas.width * 4) / 5,
      }),
    });
    toast('若分享成功，请从群里点击会话查看群排行榜');
  } catch (e: any) {
    toast(`分享失败: ${e.message}`);
  }
}

/** 订阅系统消息（好友互动提醒 / 排行榜好友超越提醒） */
export function subscribeSystemMessage() {
  wx.requestSubscribeSystemMessage({
    msgTypeList: ['SYS_MSG_TYPE_INTERACTIVE', 'SYS_MSG_TYPE_RANK'],
    success(res: any) {
      let tips = '成功订阅';
      if (res.SYS_MSG_TYPE_INTERACTIVE === 'accept') {
        tips += '好友互动提醒';
      }
      if (res.SYS_MSG_TYPE_RANK === 'accept') {
        if (tips !== '成功订阅') tips += '和';
        tips += '排行榜好友超越提醒';
      }
      toast(tips);
    },
    fail(res: any) {
      toast(`订阅失败: ${res?.errMsg || ''}`);
    },
  });
}

/**
 * 页面加载时注册 onShow 监听：
 * 当通过 shareGroupRank 分享的卡片从群内重新打开时，
 * 携带的 shareTicket 会触发群排行榜渲染。
 */
export function onLoad() {
  const detectGroupRank = (res: any) => {
    const q = res?.query || {};
    if (res?.shareTicket && q.showGroup === '1') {
      try {
        display.showCanvas?.();
        wx.getOpenDataContext().postMessage({
          event: 'showGroupRank',
          shareTicket: res.shareTicket,
        });
      } catch (e: any) {
        toast(`群排行发送失败: ${e.message}`);
      }
    }
  };

  onShowFn = detectGroupRank;
  wx.onShow(detectGroupRank);

  // 启动场景也要检测一次（冷启动带 shareTicket 进来）
  try {
    detectGroupRank(wx.getLaunchOptionsSync());
  } catch (_e) {
    /* noop */
  }
}

export function onUnload() {
  if (onShowFn) {
    (wx as any).offShow?.(onShowFn);
    onShowFn = null;
  }
  // 关闭子域画布
  try {
    wx.getOpenDataContext().postMessage({ event: 'close' });
  } catch (_e) {
    /* noop */
  }
}
