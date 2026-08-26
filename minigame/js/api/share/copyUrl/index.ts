/**
 * 复制链接
 * wx.onCopyUrl / wx.offCopyUrl
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.onCopyUrl.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.offCopyUrl.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮注册/取消复制链接监听，事件信息将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'copyUrl';
let copyUrlFn: any = null;

/** 是否为 PC 平台 */
function isPC() {
  const { platform } = wx.getSystemInfoSync();
  return platform === 'windows' || platform === 'mac';
}

/** 基础用法：同步返回分享参数 */
export function onCopyUrl() {
  if (isPC()) {
    wx.showToast({ title: '该功能仅支持移动端', icon: 'none', duration: 1000 });
    return;
  }
  copyUrlFn = () => {
    setInfo('复制链接回调已触发（同步）\n\n返回参数:\n  query: a=1&b=2');
    return { query: 'a=1&b=2' };
  };
  wx.onCopyUrl(copyUrlFn);
  setInfo('已设置同步复制链接回调\n\n请点击右上角菜单 → 复制链接，触发后此处会显示回调结果');
}

/** 使用 promise 异步返回分享参数 */
export function onCopyUrlAsync() {
  if (isPC()) {
    wx.showToast({ title: '该功能仅支持移动端', icon: 'none', duration: 1000 });
    return;
  }
  copyUrlFn = () => {
    setInfo('复制链接回调已触发（异步）\n\n默认参数:\n  query: a=1\n  title: 默认标题\n\n500ms 后异步覆盖:\n  query: a=1&b=2&async=true\n  title: 异步标题');
    return {
      query: 'a=1',
      title: '默认标题',
      promise: new Promise((resolve) => {
        setTimeout(() => {
          resolve({ query: 'a=1&b=2&async=true', title: '异步标题' });
        }, 500);
      }),
    };
  };
  wx.onCopyUrl(copyUrlFn);
  setInfo('已设置异步复制链接回调\n\n请点击右上角菜单 → 复制链接，触发后此处会显示回调结果');
}

/** 取消绑定复制链接 */
export function offCopyUrl() {
  if (isPC()) {
    wx.showToast({ title: '该功能仅支持移动端', icon: 'none', duration: 1000 });
    return;
  }
  if (copyUrlFn) {
    wx.offCopyUrl();
    copyUrlFn = null;
    setInfo('已取消复制链接回调');
  } else {
    setInfo('当前无回调，无需取消');
  }
}

export function onUnload() {
  if (copyUrlFn) {
    wx.offCopyUrl();
    copyUrlFn = null;
  }
}
