/**
 * 群任务 - 任务详情
 *
 * 涉及 API：
 * - wx.openChatTool / wx.isChatTool / wx.getChatToolInfo — 聊天工具模式管理
 * - wx.cloud.callFunction('selectRecord') — 获取活动记录
 * - wx.cloud.callFunction('signIn') — 做任务/签到
 * - wx.cloud.callFunction('updateChatToolMsg') — 更新动态消息
 * - wx.notifyGroupMembers — 通知群成员
 * - wx.shareEmojiToGroup — 分享表情到群
 * - wx.shareImageToGroup — 分享图片到群
 * - wx.getOpenDataContext / postMessage — 开放数据域通信
 * - Canvas 离屏绘制 — drawProgress 环形进度条
 */

import { ActivityInfo, GroupInfo, DrawGroupTaskDetailOption } from '../shared/types';
import { GROUP_TASK_RESULT_EMOJI_URL, ACTIVITY_TEMPLATE_ID_2 } from '../shared/const';
import { getGroupInfo, getGroupTaskDetailPath, openChatTool, showToast } from '../shared/util';
import { drawProgress } from '../drawProgress';

const { envVersion } = wx.getAccountInfoSync().miniProgram;
const getVersionType = () => envVersion === 'release' ? 0 : envVersion === 'develop' ? 1 : 2;

// ===== 业务状态 =====
let activityId = '';
let activityInfo: ActivityInfo = {};
let groupInfo: GroupInfo = {};
let signIn: string[] = [];
let notSignIn: string[] = [];
let participant: string[] = [];
let participantCnt = 0;
let taskCnt = 0;
let selfTaskCnt = 0;
const targetTaskNum = 5;
let isOwner = false;
let isParticipant = false;
let watchingParticipated = true;

// ===== setter：UI 层绑定 =====
let _onDataRefresh: ((option: DrawGroupTaskDetailOption) => void) | null = null;
export function setOnDataRefresh(fn: (option: DrawGroupTaskDetailOption) => void) { _onDataRefresh = fn; }

let _onOpenDataContextReady: ((data: any) => void) | null = null;
export function setOnOpenDataContextReady(fn: (data: any) => void) { _onOpenDataContextReady = fn; }

// ===== API 调用 =====

/** 初始化（传入 activityId） */
export function init(id: string) {
  activityId = id;
}

/** 获取活动详情 */
export async function fetchActivity() {
  wx.showLoading({ title: '加载中', mask: true });

  try {
    groupInfo = await getGroupInfo() as GroupInfo;

    const selectRecord = () => {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: { type: 'selectRecord', activityId },
      }).then((resp: any) => {
        if (resp.result.success) {
          activityInfo = resp.result.activityInfo;
          refreshData();
          notifyOpenDataContext();
        } else {
          showToast('活动未找到');
        }
      }).catch(() => { showToast('加载活动失败'); });
    };

    // @ts-ignore
    if (!wx.isChatTool()) {
      openChatTool({
        roomid: groupInfo.roomid,
        chatType: groupInfo.chatType,
        success() { selectRecord(); },
        fail() { showToast('进入聊天工具模式失败'); },
      });
    } else {
      selectRecord();
    }
  } catch (err) {
    console.error('getGroupInfo fail:', err);
    showToast('获取群信息失败');
  }
}

/** 做任务（签到） */
export function doTask() {
  wx.showLoading({ title: '做任务中', mask: true });

  wx.cloud.callFunction({
    name: 'quickstartFunctions',
    data: {
      type: 'signIn',
      roomid: groupInfo.roomid,
      groupOpenID: groupInfo.groupOpenID,
      activityId,
    },
  }).then((resp: any) => {
    if (resp.result.success) {
      activityInfo.signIn?.push(groupInfo.groupOpenID || '');
      refreshData();
      updateChatToolMsg(taskCnt >= targetTaskNum ? 3 : 1, [{ groupOpenID: groupInfo.groupOpenID, state: 1 }]);
      showToast(`已加入，打了${selfTaskCnt}次`);
    } else {
      showToast('做任务失败');
    }
  }).catch(() => { showToast('做任务失败'); });
}

/** 提前终止活动 */
export function earlyTerminate() {
  wx.showLoading({ title: '结束中', mask: true });
  updateChatToolMsg(3);
}

/** 分享结果表情 */
export function shareResult() {
  wx.downloadFile({
    url: GROUP_TASK_RESULT_EMOJI_URL,
    success(res: any) {
      // @ts-ignore
      wx.shareEmojiToGroup({
        imagePath: res.tempFilePath,
        entrancePath: getGroupTaskDetailPath(activityId),
      });
    },
  });
}

/** 分享进度图 */
export function shareProgress() {
  const { pixelRatio } = wx.getSystemInfoSync();
  const progressCanvas = drawProgress(taskCnt, targetTaskNum, pixelRatio);
  progressCanvas.toTempFilePath({
    success(res: any) {
      // @ts-ignore
      wx.shareImageToGroup({
        imagePath: res.tempFilePath,
        needShowEntrance: true,
        entrancePath: getGroupTaskDetailPath(activityId),
      });
    },
  });
}

/** 通知未参与的成员 */
export function notifyMembers() {
  // @ts-ignore
  wx.notifyGroupMembers({
    title: activityInfo.taskTitle || '示例',
    type: 'participate',
    members: notSignIn,
    entrancePath: getGroupTaskDetailPath(activityId),
    complete(res: any) { console.log('notifyGroupMembers:', res); },
  });
}

/** 分享/提醒：根据状态自动选择操作 */
export function handleShareOrNotify() {
  if (activityInfo.isFinished || taskCnt >= targetTaskNum) {
    shareResult();
  } else if (activityInfo.isUsingSpecify) {
    notifyMembers();
  } else {
    shareProgress();
  }
}

/** 切换查看「已参与」 */
export function switchToParticipated() {
  watchingParticipated = true;
  notifyOpenDataContext();
}

/** 切换查看「未参与」 */
export function switchToNotParticipated() {
  watchingParticipated = false;
  notifyOpenDataContext();
}

/** 清理状态 */
export function reset() {
  activityId = '';
  activityInfo = {};
  groupInfo = {};
  signIn = [];
  notSignIn = [];
  participant = [];
  taskCnt = 0;
  selfTaskCnt = 0;
  _onDataRefresh = null;
  _onOpenDataContextReady = null;
}

// ===== 内部方法 =====

function refreshData() {
  const { groupOpenID, roomid, openid } = groupInfo;
  participant = activityInfo.participant || [];
  signIn = activityInfo.signIn || [];
  taskCnt = signIn.length;
  selfTaskCnt = signIn.filter(i => i === groupOpenID).length;
  participantCnt = new Set(signIn).size;
  notSignIn = participant.filter(i => !signIn.includes(i));
  isOwner = activityInfo.creator === openid;

  if (roomid !== activityInfo.roomid) {
    isParticipant = false;
  } else {
    isParticipant = !activityInfo.isUsingSpecify || participant.includes(groupOpenID || '');
  }

  _onDataRefresh?.({
    isOwner,
    isUsingSpecify: activityInfo.isUsingSpecify || false,
    isFinished: activityInfo.isFinished || false,
    isParticipated: selfTaskCnt > 0,
    isParticipant,
    participantCnt,
    taskCnt,
    targetTaskNum,
    taskTitle: activityInfo.taskTitle || '示例',
  });
}

function notifyOpenDataContext() {
  const isShowParticipated = !activityInfo.isUsingSpecify || watchingParticipated;
  _onOpenDataContextReady?.({
    members: isShowParticipated ? signIn : notSignIn,
    isRenderCount: isShowParticipated,
    isUsingSpecify: activityInfo.isUsingSpecify,
    chatType: groupInfo.chatType,
    roomid: groupInfo.roomid,
    participant,
  });
  wx.hideLoading();
}

function updateChatToolMsg(targetState: number, parameterList: any[] = []) {
  wx.cloud.callFunction({
    name: 'openapi',
    data: {
      action: 'updateChatToolMsg',
      activityId,
      targetState,
      templateId: ACTIVITY_TEMPLATE_ID_2,
      parameterList,
      versionType: getVersionType(),
    },
  }).then(() => { fetchActivity(); })
    .catch(() => { showToast('更新失败'); });
}
