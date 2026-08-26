/**
 * 收藏监听
 * wx.onAddToFavorites / wx.offAddToFavorites
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.onAddToFavorites.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.offAddToFavorites.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮注册/取消收藏监听，事件信息将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'addToFavorites';
let favoritesFn: any = null;

/** 是否为 PC 平台 */
function isPC() {
  const { platform } = wx.getSystemInfoSync();
  return platform === 'windows' || platform === 'mac';
}

/** 监听用户添加收藏 */
export function onAddToFavorites() {
  if (isPC()) {
    wx.showToast({ title: '该功能仅支持移动端', icon: 'none', duration: 1000 });
    return;
  }
  if (favoritesFn) {
    setInfo('已在监听中，请先取消');
    return;
  }
  favoritesFn = () => {
    setInfo('收藏事件已触发\n\n返回参数:\n  title: 小游戏 API 示例 - 收藏\n  query: pathName=' + window.router.getNowPageName());
    return {
      title: '小游戏 API 示例 - 收藏',
      imageUrl: '',
      query: `pathName=${window.router.getNowPageName()}`,
    };
  };
  (wx as any).onAddToFavorites(favoritesFn);
  setInfo('已注册收藏监听\n\n请点击右上角菜单 → 收藏，触发后此处会显示回调结果');
}

/** 取消监听收藏 */
export function offAddToFavorites() {
  if (isPC()) {
    wx.showToast({ title: '该功能仅支持移动端', icon: 'none', duration: 1000 });
    return;
  }
  if (favoritesFn) {
    (wx as any).offAddToFavorites(favoritesFn);
    favoritesFn = null;
    setInfo('已取消收藏监听');
  } else {
    setInfo('当前无监听，无需取消');
  }
}

export function onUnload() {
  if (favoritesFn) {
    (wx as any).offAddToFavorites(favoritesFn);
    favoritesFn = null;
  }
}
