/**
 * 隐私授权
 * wx.requirePrivacyAuthorize / wx.openPrivacyContract / wx.getPrivacySetting
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/privacy/wx.requirePrivacyAuthorize.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatJSON } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮管理隐私授权接口，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'privacy';
/** 主动唤起隐私授权确认弹窗 */
export function requirePrivacyAuthorize() {
  wx.requirePrivacyAuthorize({
    success() {
      wx.showToast({ title: '用户已同意隐私协议', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `授权失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 打开隐私协议页面 */
export function openPrivacyContract() {
  wx.openPrivacyContract({
    success() {
      wx.showToast({ title: '已打开隐私协议', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `打开失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 查询隐私授权状态 */
export function getPrivacySetting() {
  wx.getPrivacySetting({
    success(res: any) {
      setInfo(formatJSON(res));
    },
    fail(err: any) {
      wx.showToast({ title: `查询失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
