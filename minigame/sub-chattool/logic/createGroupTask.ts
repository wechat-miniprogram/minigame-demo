/**
 * 群任务 - 创建任务
 *
 * 涉及 API：
 * - wx.selectGroupMembers — 选择群成员
 * - wx.cloud.callFunction('createActivityId') — 创建活动ID
 * - wx.cloud.callFunction('addRecord') — 写入数据库
 * - wx.updateShareMenu + wx.shareAppMessageToGroup — 动态消息分享到群
 */

import {
  getGroupInfo,
  shareAppMessageToGroup,
  showToast,
} from '../shared/util';

let activityId = '';
let isUsingSpecify = false;
let participant: string[] = [];
let taskTitle = '';

// ===== setter：UI 层绑定 =====
let _onParticipantUpdate: ((count: number) => void) | null = null;
export function setOnParticipantUpdate(fn: (count: number) => void) {
  _onParticipantUpdate = fn;
}

let _onPublishSuccess: (() => void) | null = null;
export function setOnPublishSuccess(fn: () => void) {
  _onPublishSuccess = fn;
}

// ===== API 调用 =====

/** 设置任务标题 */
export function setTaskTitle(title: string) {
  taskTitle = title;
}

/** 获取当前标题 */
export function getTaskTitle() {
  return taskTitle;
}

/** 选择所有群成员参与 */
export function selectAllParticipant() {
  isUsingSpecify = false;
  participant = [];
}

/** 选择指定群成员参与 */
export function selectSpecifyParticipant() {
  isUsingSpecify = true;
  wx.selectGroupMembers({
    success(res: any) {
      participant = res.members;
      _onParticipantUpdate?.(res.members.length);
    },
    fail(err: any) {
      console.error('selectGroupMembers fail:', err);
    },
  });
}

/** 创建活动ID */
function createActivityID(): Promise<void> {
  return wx.cloud
    .callFunction({
      name: 'openapi',
      data: { action: 'createActivityId' },
    })
    .then((resp: any) => {
      if (resp.result) {
        activityId = resp.result.activityId;
      }
    })
    .catch((err: any) => {
      console.error('createActivityId fail:', err);
    });
}

/** 发布任务（完整流程：校验 → 创建ID → 获取群信息 → 写库 → 分享到群） */
export async function publish() {
  if (!taskTitle) {
    wx.showToast({ title: '请输入任务名称', icon: 'none' });
    return;
  }
  if (taskTitle.includes(' ')) {
    wx.showToast({ title: '任务名称不能包含空格', icon: 'none' });
    return;
  }

  wx.showLoading({ title: '发布中...', mask: true });

  if (!activityId) {
    await createActivityID();
  }

  try {
    const groupInfo: any = await getGroupInfo();

    // 单聊时强制获取参与双方
    if (groupInfo.chatType === 1 && participant.length === 0) {
      await new Promise<void>((resolve, reject) => {
        wx.selectGroupMembers({
          success(res: any) {
            participant = res.members;
            resolve();
          },
          fail: reject,
        });
      });
    }

    // 写入数据库
    await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'addRecord',
        activityId,
        roomid: groupInfo.roomid,
        chatType: groupInfo.chatType,
        participant,
        signIn: [],
        isUsingSpecify,
        isFinished: false,
        taskTitle,
      },
    });

    // 分享到群聊
    shareAppMessageToGroup({
      activityId,
      participant,
      chooseType: isUsingSpecify ? 1 : 2,
      taskTitle,
      success() {
        wx.hideLoading();
        activityId = '';
        _onPublishSuccess?.();
      },
      fail() {
        showToast('分享失败');
      },
    });
  } catch (err) {
    console.error('publish fail:', err);
    showToast('发布失败');
  }
}

/** 清理状态 */
export function reset() {
  activityId = '';
  isUsingSpecify = false;
  participant = [];
  taskTitle = '';
  _onParticipantUpdate = null;
  _onPublishSuccess = null;
}
