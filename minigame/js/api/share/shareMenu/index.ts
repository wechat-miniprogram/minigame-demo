/**
 * 转发菜单控制
 * wx.updateShareMenu / wx.showShareMenu / wx.hideShareMenu
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮开启/关闭/更新分享菜单。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'shareMenu';

/** 更新分享菜单：启用 withShareTicket */
export function enableShareTicket() {
  wx.updateShareMenu({
    withShareTicket: true,
    success() {
      setInfo('withShareTicket=true 已生效');
    },
    fail(err: any) {
      setInfo(`设置失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 更新分享菜单：设置为私密分享 */
export function enablePrivateMode() {
  wx.updateShareMenu({
    withShareTicket: true,
    isPrivateMessage: true,
    activityId: 'demo_activity',
    success() {
      setInfo('私密分享模式已生效');
    },
    fail(err: any) {
      setInfo(`设置失败: ${err?.errMsg || '未知错误'}`);
    },
  } as any);
}

/** 显示转发按钮（withShareTicket=true） */
export function showShareMenu() {
  wx.showShareMenu({
    withShareTicket: true,
    success() {
      setInfo('转发按钮已显示（withShareTicket=true）');
    },
    fail(err: any) {
      setInfo(`显示失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 显示转发按钮（不带 withShareTicket） */
export function showShareMenuBasic() {
  wx.showShareMenu({
    success() {
      setInfo('转发按钮已显示');
    },
    fail(err: any) {
      setInfo(`显示失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 隐藏转发按钮 */
export function hideShareMenu() {
  wx.hideShareMenu({
    success() {
      setInfo('转发按钮已隐藏');
    },
    fail(err: any) {
      setInfo(`隐藏失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 分享活动 */
export function shareAppMessage() {
  wx.shareAppMessage({
    title: '一起来玩活动',
    imageUrl: '',
    query: 'activityId=demo_activity',
    activityId: 'demo_activity',
  } as any);
  setInfo('已触发活动分享');
}
