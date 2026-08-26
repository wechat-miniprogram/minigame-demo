/**
 * 菜单
 * wx.setMenuStyle / wx.getMenuButtonBoundingClientRect
 * wx.onOfficialComponentsInfoChange / wx.offOfficialComponentsInfoChange
 * wx.getOfficialComponentsInfo
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/menu/wx.setMenuStyle.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取菜单信息或切换菜单样式，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'menu';
let officialListener: any = null;

/** 查询胶囊菜单按钮位置 */
export function getMenuRect() {
  const rect = wx.getMenuButtonBoundingClientRect();
  if (!rect) {
    setInfo('获取菜单按钮位置失败');
    return;
  }
  setInfo(
    formatObj({
      top: String(rect.top),
      right: String(rect.right),
      width: String(rect.width),
      height: String(rect.height),
    })
  );
}

/** 是否为 PC 平台 */
function isPC() {
  const { platform } = wx.getSystemInfoSync();
  return platform === 'windows' || platform === 'mac';
}

/** 切换菜单为深色样式 */
export function setMenuDark() {
  if (isPC()) {
    wx.showToast({ title: '该功能仅支持移动端', icon: 'none', duration: 1000 });
    return;
  }
  wx.setMenuStyle({
    style: 'dark',
    success() {
      wx.showToast({ title: '菜单已设为深色', icon: 'none', duration: 1000 });
    },
    fail(err: any) {
      wx.showToast({ title: `失败：${err?.errMsg || '未知错误'}`, icon: 'none', duration: 1000 });
    },
  });
}

/** 切换菜单为浅色样式 */
export function setMenuLight() {
  if (isPC()) {
    wx.showToast({ title: '该功能仅支持移动端', icon: 'none', duration: 1000 });
    return;
  }
  wx.setMenuStyle({
    style: 'light',
    success() {
      wx.showToast({ title: '菜单已设为浅色', icon: 'none', duration: 1000 });
    },
  });
}

/** 查询官方组件信息（胶囊、tabbar 等） */
export function getOfficialComponents() {
  const info: any = wx.getOfficialComponentsInfo?.() || {};
  setInfo(
    formatObj({
      数据: JSON.stringify(info),
    })
  );
}

/** 监听官方组件变化 */
export function onOfficialChange() {
  officialListener = (res: any) => {
    setInfo(
      formatObj({
        事件: 'officialChange',
        详情: JSON.stringify(res),
      })
    );
  };
  wx.onOfficialComponentsInfoChange?.(officialListener);
  wx.showToast({ title: '已注册官方组件变化监听', icon: 'none', duration: 1000 });
}

/** 取消监听官方组件变化 */
export function offOfficialChange() {
  if (officialListener) {
    wx.offOfficialComponentsInfoChange?.(officialListener);
    officialListener = null;
    wx.showToast({ title: '已取消官方组件变化监听', icon: 'none', duration: 1000 });
  } else {
    wx.showToast({ title: '当前无监听，无需取消', icon: 'none', duration: 1000 });
  }
}

export function onUnload() {
  if (officialListener) {
    wx.offOfficialComponentsInfoChange?.(officialListener);
    officialListener = null;
  }
}
