/**
 * 获取用户信息
 * wx.getUserInfo / wx.createUserInfoButton
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatJSON } from '../../../libs/format';
import { calcNativeButtonPosBottom, GREEN_BUTTON_STYLE } from '../../../libs/native-button-pos';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取用户信息，返回数据将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'getUserInfo';
let userInfoBtn: any = null;

/** 获取用户信息（需先授权） */
export function getUserInfo() {
  wx.getUserInfo({
    success(res: any) {
      const u = res?.userInfo;
      if (!u) {
        wx.showToast({ title: '用户信息为空', icon: 'none' });
        return;
      }
      setInfo(formatJSON(u));
    },
    fail(err: any) {
      wx.showToast({ title: `getUserInfo 失败: ${err?.errMsg || '请先在设置中授权'}`, icon: 'none' });
    },
  });
}

/** 创建获取用户信息按钮（点击后会请求授权，位置在屏幕底部 logo 上方） */
export function createUserInfoButton() {
  if (userInfoBtn) {
    wx.showToast({ title: '按钮已创建，请点击按钮', icon: 'none' });
    return;
  }

  // 原生按钮固定在屏幕底部 logo 上方，避免被长文本信息区（infoArea）遮挡。
  // 不能用 calcNativeButtonPos(3)：当 setInfo 内容很多时，
  // 信息区会撑高并穿过按索引计算的位置，导致原生授权按钮落在 info 区中间。
  const pos = calcNativeButtonPosBottom();

  userInfoBtn = wx.createUserInfoButton({
    type: 'text',
    text: '点这里获取用户信息',
    style: {
      ...pos,
      ...GREEN_BUTTON_STYLE,
      lineHeight: Math.round(pos.height),
    } as any,
  });

  userInfoBtn.onTap?.((res: any) => {
    if (res.userInfo) {
      setInfo(formatJSON(res.userInfo));
    } else {
      wx.showToast({ title: '用户拒绝授权', icon: 'none' });
    }
  });
  wx.showToast({ title: '已创建授权按钮，请在下方点击', icon: 'none' });
}

/** 销毁按钮 */
export function destroyButton() {
  if (userInfoBtn) {
    userInfoBtn.destroy();
    userInfoBtn = null;
    wx.showToast({ title: '按钮已销毁', icon: 'none' });
  }
}

export function onUnload() {
  if (userInfoBtn) {
    userInfoBtn.destroy();
    userInfoBtn = null;
  }
}
