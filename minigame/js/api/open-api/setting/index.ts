/**
 * 设置
 * wx.getSetting / wx.openSetting / wx.createOpenSettingButton
 * AuthSetting / OpenSettingButton / SubscriptionsSetting
 *
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/setting/wx.getSetting.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/setting/wx.openSetting.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/setting/wx.createOpenSettingButton.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取用户授权设置，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'setting';
const SCOPE_LABELS: Record<string, string> = {
  'scope.userInfo': '用户信息',
  'scope.userLocation': '地理位置',
  'scope.werun': '微信运动',
  'scope.writePhotosAlbum': '保存到相册',
  'scope.camera': '摄像头',
  'scope.record': '录音',
  'scope.WxFriendInteraction': '好友互动',
  'scope.addPhoneContact': '通讯录',
};

function renderSettings(authSetting: Record<string, boolean>) {
  const lines: string[] = ['--- 授权设置 ---'];
  Object.keys(SCOPE_LABELS).forEach((scope) => {
    const value = authSetting[scope];
    const status =
      value === true ? '已授权' : value === false ? '已拒绝' : '未设置';
    lines.push(`${SCOPE_LABELS[scope]}: ${status}`);
  });
  setInfo(lines.join('\n'));
}

/** 获取用户当前授权设置 (AuthSetting) */
export function getSetting() {
  wx.getSetting({
    success(res: any) {
      renderSettings(res.authSetting);
      // SubscriptionsSetting
      if (res.subscriptionsSetting) {
        setInfo(
          `--- 订阅消息设置 ---\n${JSON.stringify(res.subscriptionsSetting).slice(0, 300)}`
        );
      }
    },
    fail(err: any) {
      setInfo(`获取失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 打开设置页面 */
export function openSetting() {
  wx.openSetting({
    success(res: any) {
    },
    fail(err: any) {
      setInfo(`打开失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

export function onUnload() {
}
