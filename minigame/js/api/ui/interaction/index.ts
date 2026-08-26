/**
 * 交互
 * wx.showToast / wx.hideToast / wx.showLoading / wx.hideLoading
 * wx.showModal / wx.showActionSheet
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/interaction/wx.showToast.html
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/interaction/wx.showModal.html
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/interaction/wx.showActionSheet.html
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/interaction/wx.showLoading.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮展示 Toast / Loading / Modal / ActionSheet 等交互组件。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'interaction';
/** 显示 success Toast */
export function showSuccessToast() {
  wx.showToast({
    title: '操作成功',
    icon: 'success',
    duration: 1500,
    fail(err: any) {
      setInfo(`showToast 失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 显示 loading Toast */
export function showLoadingToast() {
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 1500,
    fail(err: any) {
      setInfo(`showToast 失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 显示无图标 Toast */
export function showNoneToast() {
  wx.showToast({
    title: '提示信息',
    icon: 'none',
    duration: 1500,
    fail(err: any) {
      setInfo(`showToast 失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 隐藏 Toast */
export function hideToast() {
  wx.hideToast({
  });
}

/** 显示 Loading */
export function showLoading() {
  wx.showLoading({
    title: '加载中...',
    fail(err: any) {
      setInfo(`showLoading 失败：${err?.errMsg || '未知错误'}`);
    },
  });
  setTimeout(() => wx.hideLoading(), 2000);
}

/** 隐藏 Loading */
export function hideLoading() {
  wx.hideLoading({
  });
}

/** 显示确认弹窗 */
export function showConfirmModal() {
  wx.showModal({
    title: '提示',
    content: '这是一个确认弹窗',
    success(res: any) {
    },
    fail(err: any) {
      setInfo(`showModal 失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 显示无取消按钮弹窗 */
export function showSimpleModal() {
  wx.showModal({
    title: '提示',
    content: '这是一个无取消按钮弹窗',
    showCancel: false,
    confirmColor: '#02BB00',
    fail(err: any) {
      setInfo(`showModal 失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 显示操作菜单 */
export function showActionSheet() {
  const items = ['选项 A', '选项 B', '选项 C'];
  wx.showActionSheet({
    itemList: items,
    success(res: any) {
      wx.showToast({ title: `选中：第 ${res.tapIndex + 1} 项 "${items[res.tapIndex]}"`, icon: 'none' });
    },
    fail() {
    },
  });
}
