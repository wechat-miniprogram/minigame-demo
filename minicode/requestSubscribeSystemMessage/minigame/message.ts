const SYSTEM_MESSAGE = {
  accept: '系统消息订阅权限：已授权使用',
  acceptWithAlert: '系统消息订阅权限：已授权使用',
  reject: '系统消息订阅权限：拒绝授权使用，可在设置页打开',
  ban: '系统消息订阅权限：该功能已被后台封禁',
  undefined: '系统消息订阅权限：该功能未向用户请求过',
};
// eslint-disable-next-line @typescript-eslint/naming-convention
type SYSTEM_MESSAGE_TYPE = {
  accept: string;
  acceptWithAlert: string;
  reject: string;
  ban: string;
  undefined: string;
};

// 获取订阅消息设置
function getSubscribeSystemMessage() {
  return new Promise((resolve) => {
    wx.requestSubscribeSystemMessage({
      msgTypeList: ['SYS_MSG_TYPE_INTERACTIVE', 'SYS_MSG_TYPE_RANK'],
      success(res) {
        console.log('订阅系统消息api调用成功', res);
        if (res.SYS_MSG_TYPE_INTERACTIVE === 'reject') {
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
