/**
 * 实时语音通话（VoIP Chat）
 * wx.joinVoIPChat / wx.exitVoIPChat / wx.updateVoIPChatMuteConfig /
 * wx.onVoIPChatMembersChanged / wx.onVoIPChatInterrupted
 *
 * 纯 API 逻辑 + 回调钩子，UI 由 rich-config 渲染
 */

// ========== 回调钩子 ==========
let onJoinCb: ((roomName: string, memberCount: number) => void) | null = null;
let onMemberChangeCb: ((memberCount: number) => void) | null = null;
let onExitCb: (() => void) | null = null;

export function setOnJoin(cb: (roomName: string, memberCount: number) => void) {
  onJoinCb = cb;
}
export function setOnMemberChange(cb: (memberCount: number) => void) {
  onMemberChangeCb = cb;
}
export function setOnExit(cb: () => void) {
  onExitCb = cb;
}

// ========== 状态 ==========
let groupId = '';
let scopeRecord = false;
let micMuted = false; // false = 开启(on), true = 静音(off)
let earMuted = false;
let joined = false;

// ========== 工具函数 ==========

function toast(title: string) {
  wx.showToast({ title, icon: 'none' });
}

function authorizeRecord(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (scopeRecord) return resolve();
    wx.getSetting({
      success(res: any) {
        scopeRecord = res.authSetting['scope.record'];
        if (scopeRecord) return resolve();
        wx.authorize({
          scope: 'scope.record',
          success() {
            scopeRecord = true;
            resolve();
          },
          fail() {
            scopeRecord = false;
            reject(new Error('未授权录音权限'));
          },
        });
      },
      fail: reject,
    });
  });
}

function getSignature(gId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'getSignature',
      data: { groupId: gId },
      success(res: any) {
        resolve(res.result);
      },
      fail(res: any) {
        reject(res);
      },
    });
  });
}

// ========== 导出函数 ==========

/** 是否已在房间中 */
export function isJoined() {
  return joined;
}

/** 获取当前房间名 */
export function getRoomName() {
  return groupId;
}

/** 加入（创建）实时语音通话房间 */
export function joinChat() {
  const { platform } = wx.getSystemInfoSync();
  if (platform === 'windows' || platform === 'mac') {
    toast('该功能仅支持移动端');
    return;
  }
  if (joined) {
    return;
  }
  authorizeRecord()
    .then(() => {
      // 从分享链接进入时，复用已有的 roomName
      const query = (window as any).query;
      if (!groupId && query?.roomName) {
        groupId = query.roomName;
      }
      if (!groupId) {
        groupId = `语音房间${Math.random().toString(36).substring(2)}`;
      }
      const loadingText = query?.re_enter || '正在加入房间';
      wx.showLoading({ title: loadingText, mask: true });
      return getSignature(groupId);
    })
    .then((signData: any) => {
      return new Promise<void>((resolve, reject) => {
        wx.joinVoIPChat({
          ...signData,
          muteConfig: { muteMicrophone: micMuted, muteEarphone: earMuted },
          complete(res: any) {
            wx.hideLoading();
            if (res.errCode) {
              toast(`加入失败: ${res.errMsg || res.errCode}`);
              reject(new Error(String(res.errCode)));
            } else {
              joined = true;
              micMuted = false;
              earMuted = false;
              onJoinCb?.(groupId, res.openIdList?.length || 1);

              wx.onVoIPChatMembersChanged((ev: any) => {
                onMemberChangeCb?.(ev.openIdList?.length || 1);
              });

              wx.onVoIPChatInterrupted(() => {
                wx.offVoIPChatMembersChanged();
                wx.offVoIPChatInterrupted();
                joined = false;
                toast('语音通话被中断');
                onExitCb?.();
                // 被动断开后返回上一级
                (window as any).router.delPage();
              });

              (window as any).query = {
                pathName: (window as any).router.getNowPageName(),
                roomName: groupId,
                re_enter: '返回当前房间',
              };

              resolve();
            }
          },
        });
      });
    })
    .catch((err: any) => {
      wx.hideLoading();
      const errMsg = err?.message || err?.errMsg || err?.errCode || '未知错误';
      if (errMsg.includes('授权')) {
        toast('没有授权录音，无法加入语音通话');
      } else {
        toast(`获取签名失败: ${errMsg}`);
      }
      onExitCb?.();
    });
}

/** 切换麦克风静音状态，成功后回调 */
export function toggleMicrophone(onSuccess?: () => void) {
  if (!joined) {
    toast('请先加入房间');
    return;
  }
  micMuted = !micMuted;
  wx.updateVoIPChatMuteConfig({
    muteConfig: { muteMicrophone: micMuted, muteEarphone: earMuted },
    success() {
      onSuccess?.();
    },
    fail() {
      micMuted = !micMuted;
    },
  });
}

/** 切换耳机静音状态，成功后回调 */
export function toggleEarphone(onSuccess?: () => void) {
  if (!joined) {
    toast('请先加入房间');
    return;
  }
  earMuted = !earMuted;
  wx.updateVoIPChatMuteConfig({
    muteConfig: { muteMicrophone: micMuted, muteEarphone: earMuted },
    success() {
      onSuccess?.();
    },
    fail() {
      earMuted = !earMuted;
    },
  });
}

/** 邀请好友进入房间（主动分享） */
export function inviteFriend() {
  if (!joined || !groupId) {
    toast('请先加入房间');
    return;
  }
  let imageUrl = '';
  try {
    imageUrl = canvas.toTempFilePathSync({
      x: 0,
      y: 0,
      width: canvas.width,
      height: (canvas.width * 4) / 5,
    });
  } catch (e: any) {
    console.error('[voipChat] toTempFilePathSync 失败', e);
  }
  wx.shareAppMessage({
    title: '快来加入我的语音对话房间',
    imageUrl,
    query: `pathName=${(window as any).router.getNowPageName()}&roomName=${groupId}`,
  });
}

/** 退出（销毁）实时语音通话 */
export function exitChat() {
  if (!joined) {
    toast('当前不在房间中');
    return;
  }
  try {
    wx.offVoIPChatMembersChanged();
    wx.offVoIPChatInterrupted();
  } catch {
    /* ignore */
  }
  wx.exitVoIPChat({
    success() {
      joined = false;
      (window as any).query = null;
      toast('已退出房间');
      onExitCb?.();
      (window as any).router.delPage();
    },
  });
}

export function onUnload() {
  try {
    wx.offVoIPChatMembersChanged();
    wx.offVoIPChatInterrupted();
  } catch {
    /* ignore */
  }
  try {
    wx.exitVoIPChat({});
  } catch {
    /* ignore */
  }
  joined = false;
  groupId = '';
}
