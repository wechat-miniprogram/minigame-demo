const SYSTEM_MESSAGE = {
  accept: '系统消息订阅权限：已授权使用',
  acceptWithAlert: '系统消息订阅权限：已授权并开启弹窗提醒',
  acceptWithAudio: '系统消息订阅权限：已授权并开启语音提醒',
  acceptWithForcePush: '系统消息订阅权限：已授权并开启推送提醒',
  reject: '系统消息订阅权限：拒绝授权使用，可在设置页打开',
  ban: '系统消息订阅权限：该功能已被后台封禁',
  filter: '系统消息订阅权限：该功能已被后台过滤',
  undefined: '系统消息订阅权限：该功能未向用户请求过',
};

// eslint-disable-next-line @typescript-eslint/naming-convention
type SYSTEM_MESSAGE_TYPE = {
  accept: string; // 表示用户同意订阅该条id对应的模板消息
  acceptWithAlert: string; // 表示用户接收消息并打开提醒
  acceptWithAudio: string; // 表示用户接收订阅消息并开启了语音提醒
  acceptWithForcePush: string; // 表示用户接收订阅消息并开启了推送提醒
  reject: string; // 表示用户拒绝订阅该条id对应的模板消息
  ban: string; // 表示已被后台封禁
  filter: string; // 表示该模板因为模板标题同名被后台过滤
  undefined: string;
};

// 获取订阅消息设置
function getSubscribeSystemMessage() {
  return new Promise((resolve) => {
    wx.requestSubscribeSystemMessage({
      msgTypeList: ['SYS_MSG_TYPE_INTERACTIVE', 'SYS_MSG_TYPE_RANK'],
      success(res: any) {
        console.log('订阅系统消息api调用成功', res);
        if (res['SYS_MSG_TYPE_INTERACTIVE'] === 'reject') {
          navigateToSetting('系统订阅消息');
        }
        resolve('');
      },
      fail: (res) => {
        console.log('订阅系统消息api调用失败', res);
        if (res.errMsg.indexOf('The main switch is switched off') > -1) {
          navigateToSetting('系统订阅消息');
        }
        resolve('');
      },
    });
  });
}

// 获取朋友关系权限
function getWxFriendInteraction() {
  return new Promise((resolve) => {
    wx.authorize({
      scope: 'scope.WxFriendInteraction',
      success: (res) => {
        console.log('authorize-success => ', res);
      },
      fail: (res) => {
        console.log('authorize-fail => ', res);
        if (res.errMsg.indexOf('auth deny') > -1) {
          navigateToSetting('微信朋友关系');
        }
      },
      complete: () => {
        resolve('');
      },
    });
  });
}

// 拒绝授权后经询问跳转到设置页
function navigateToSetting(auth: string) {
  wx.showModal({
    content: `是否跳转到设置页授权${auth}`,
    success: (res) => {
      if (res.confirm) {
        wx.openSetting({});
      }
    },
  });
}

export {
  getSubscribeSystemMessage,
  getWxFriendInteraction,
  SYSTEM_MESSAGE,
  SYSTEM_MESSAGE_TYPE,
};
