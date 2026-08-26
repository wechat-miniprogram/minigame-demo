import { GROUP_TASK_SHARE_APP_MESSAGE_IMAGE_URL } from './const';
import { GroupInfo, ShareAppMessageToGroupOption, OpenChatToolOption } from './types';

/**
 * 显示版本提示弹窗
 */
export function showVersionTip() {
  wx.showModal({
    content: '需更新到客户端版本 ≥ 8.0.57，基础库版本 ≥ 3.7.12',
    showCancel: false,
    confirmColor: '#02BB00',
  });
  wx.hideLoading();
}

/**
 * 获取群聊信息
 * 优先通过 getChatToolInfo 获取，失败则 fallback 到 getGroupEnterInfo
 */
export function getGroupInfo(): Promise<GroupInfo> {
  function getInfoSuccess(resolve: any, reject: any, res: any) {
    const cloudID = res.cloudID;
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getGroupEnterInfo',
        groupInfo: wx.cloud.CloudID(cloudID),
      },
    }).then((resp: any) => {
      const groupInfo = resp.result.groupInfo;
      if (groupInfo?.data) {
        resolve({
          openid: resp.result.openid,
          groupOpenID: groupInfo.data.group_openid,
          roomid: groupInfo.data.opengid || groupInfo.data.open_single_roomid,
          chatType: groupInfo.data.chat_type,
        });
      } else {
        reject('groupInfo data 为空');
      }
    }).catch((err: any) => {
      reject(err);
    });
  }

  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (!wx.getChatToolInfo) {
      showVersionTip();
      reject('微信版本过低');
      return;
    }

    // @ts-ignore
    wx.getChatToolInfo({
      success(res: any) {
        getInfoSuccess(resolve, reject, res);
      },
      fail() {
        // fallback: 通过 getGroupEnterInfo 获取
        wx.getGroupEnterInfo({
          // @ts-ignore
          allowSingleChat: true,
          needGroupOpenID: true,
          success(res: any) {
            getInfoSuccess(resolve, reject, res);
          },
          fail(err: any) {
            showToast('获取群聊信息失败');
            reject(err);
          },
        });
      },
    });
  });
}

/**
 * 获取群任务分享页面路径
 * 注意：必须指向分包入口 groupTask，不能指向 groupTaskDetail，
 * 因为主路由 treePage 中只注册了 'groupTask' 这个入口名。
 * activityId 等参数通过 query 传递给 chattool 内部路由。
 */
export function getGroupTaskDetailPath(activityId: string) {
  return `?pathName=groupTask&activityId=${activityId}`;
}

/**
 * 打开聊天工具
 * 如果当前已处于聊天工具模式，先退出再重新打开
 */
export function openChatTool(option: OpenChatToolOption) {
  const { roomid, chatType, success, fail } = option;

  // @ts-ignore
  if (!wx.isChatTool) {
    showVersionTip();
    return;
  }

  // @ts-ignore
  if (wx.isChatTool()) {
    // @ts-ignore
    wx.exitChatTool({
      success: () => {
        openChatTool({ roomid, chatType, success, fail });
      },
      fail: (err: any) => {
        showToast('退出聊天工具模式失败');
        console.error('exitChatTool fail:', err);
      },
    });
  } else {
    // @ts-ignore
    wx.openChatTool({ roomid, chatType, success, fail });
  }
}

/**
 * 分享消息到群聊
 * 使用动态消息（updateShareMenu）+ shareAppMessageToGroup 组合实现
 */
export function shareAppMessageToGroup(option: ShareAppMessageToGroupOption) {
  const { activityId, participant, chooseType, taskTitle, success, fail } = option;

  const templateInfo = {
    templateId: '2A84254B945674A2F88CE4970782C402795EB607',
    parameterList: [
      { name: 'member_count', value: '0' },
      { name: 'room_limit', value: '5' },
    ],
  };

  wx.updateShareMenu({
    withShareTicket: true,
    isUpdatableMessage: true,
    activityId,
    participant,
    useForChatTool: true,
    chooseType,
    templateInfo,
    success() {
      // @ts-ignore
      wx.shareAppMessageToGroup({
        title: taskTitle,
        imageUrl: GROUP_TASK_SHARE_APP_MESSAGE_IMAGE_URL,
        path: getGroupTaskDetailPath(activityId),
        success,
        fail,
      });
    },
    fail(err: any) {
      console.error('updateShareMenu fail:', err);
    },
  });
}

/**
 * 显示提示信息
 */
export function showToast(title: string, icon?: 'success' | 'error' | 'loading' | 'none') {
  wx.hideLoading();
  wx.showToast({ title, icon });
}
