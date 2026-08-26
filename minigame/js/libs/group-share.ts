/**
 * 群分享回流工具
 *
 * 提取"分享到群 → 检测群聊回流 → 获取群信息"的通用流程，
 * 供 open-api/group 和 share/getShareInfo 复用。
 *
 * 用法：
 *   import { createGroupShareFlow } from '../../../libs/group-share';
 *
 *   const flow = createGroupShareFlow({
 *     onStatus: (msg) => setInfo(msg),       // 状态/结果回调
 *     onResult: (info) => setInfo(formatObj(info)),
 *     onError: (err) => setInfo(err),
 *   });
 *
 *   export function shareToGroup() { flow.shareToGroup(); }
 *   export function onLoad() { flow.onLoad(); }
 *   export function onUnload() { flow.onUnload(); }
 */

interface GroupShareFlowOptions {
  /** 分享触发 / 状态变化提示 */
  onStatus: (msg: string) => void;
  /** getGroupEnterInfo 成功回调 */
  onResult: (info: any) => void;
  /** getGroupEnterInfo 失败回调 */
  onError: (errMsg: string) => void;
  /** 分享标题（可选） */
  shareTitle?: string;
  /** 分享 query（可选） */
  shareQuery?: string;
}

export interface GroupShareFlow {
  /** 分享到群 */
  shareToGroup(): void;
  /** 页面加载时注册 onShow 监听 + 冷启动检测 */
  onLoad(): void;
  /** 页面卸载时清理监听 */
  onUnload(): void;
}

/**
 * 创建群分享回流流程实例
 *
 * 内部维护 lastProcessedTicket 去重，避免同一个 shareTicket
 * 被重复处理。
 */
export function createGroupShareFlow(opts: GroupShareFlowOptions): GroupShareFlow {
  const {
    onStatus,
    onResult,
    onError,
    shareTitle = '来试试这个小游戏吧！',
    shareQuery = 'fromGroupShare=1',
  } = opts;

  let lastProcessedTicket = '';
  let onShowFn: ((res: any) => void) | null = null;

  function shareToGroup() {
    try {
      const imageUrl = canvas.toTempFilePathSync({
        x: 0,
        y: 0,
        width: canvas.width,
        height: (canvas.width * 4) / 5,
      });
      wx.shareAppMessage({
        title: shareTitle,
        query: shareQuery,
        imageUrl,
      });
      onStatus('已触发分享，请从群里点击会话卡片进入\n将自动获取群进群信息');
    } catch (e: any) {
      onStatus(`分享失败: ${e?.message || e}`);
    }
  }

  function detectAndGet(res: any) {
    const ticket = res?.shareTicket;
    if (!ticket || ticket === lastProcessedTicket) return;
    lastProcessedTicket = ticket;

    onStatus('检测到群聊进入，正在获取群进群信息...');

    wx.getGroupEnterInfo({
      success(info: any) {
        onResult(info);
      },
      fail(err: any) {
        onError(err?.errMsg || '未知错误');
      },
    });
  }

  function onLoad() {
    onShowFn = detectAndGet;
    wx.onShow(detectAndGet);

    // 冷启动也可能携带 shareTicket（如从群内分享卡片直接启动）
    try {
      detectAndGet(wx.getLaunchOptionsSync());
    } catch (_e) {
      /* noop */
    }
  }

  function onUnload() {
    if (onShowFn) {
      (wx as any).offShow?.(onShowFn);
      onShowFn = null;
    }
  }

  return { shareToGroup, onLoad, onUnload };
}
