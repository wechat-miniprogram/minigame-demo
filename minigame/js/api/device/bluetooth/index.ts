/**
 * 蓝牙
 * wx.openBluetoothAdapter / wx.closeBluetoothAdapter / wx.getBluetoothAdapterState /
 * wx.onBluetoothAdapterStateChange / wx.offBluetoothAdapterStateChange /
 * wx.startBluetoothDevicesDiscovery / wx.stopBluetoothDevicesDiscovery /
 * wx.getBluetoothDevices
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/bluetooth/wx.openBluetoothAdapter.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮搜索/连接蓝牙设备，数据变化将通过 Toast 提示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'bluetooth';
let stateListener: ((res: any) => void) | null = null;

/** 是否为 PC 平台（蓝牙仅支持移动端） */
function isPC() {
  const { platform } = wx.getSystemInfoSync();
  return platform === 'windows' || platform === 'mac';
}

/** PC 平台统一拦截：提示并返回 true 表示已被拦截 */
function guardPC(): boolean {
  if (isPC()) {
    wx.showToast({ title: '蓝牙仅支持移动端', icon: 'none', duration: 1500 });
    return true;
  }
  return false;
}

/** 打开蓝牙适配器 */
export function openBluetoothAdapter() {
  if (guardPC()) return;
  wx.openBluetoothAdapter({
    mode: 'central',
    success() {
      wx.showToast({ title: '蓝牙适配器已打开', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `打开失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 关闭蓝牙适配器 */
export function closeBluetoothAdapter() {
  if (guardPC()) return;
  (wx as any).closeBluetoothAdapter({
    success() {
      wx.showToast({ title: '蓝牙适配器已关闭', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `关闭失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 获取本机蓝牙状态 */
export function getBluetoothAdapterState() {
  if (guardPC()) return;
  wx.getBluetoothAdapterState({
    success(res: any) {
      wx.showToast({ title: `discovering: ${res.discovering}  available: ${res.available}`, icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `查询失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 监听蓝牙状态变化 */
export function onAdapterStateChange() {
  if (guardPC()) return;
  stateListener = (res: any) => {
    wx.showToast({ title: `available: ${res?.available} discovering: ${res?.discovering}`, icon: 'none' });
  };
  wx.onBluetoothAdapterStateChange(stateListener);
  wx.showToast({ title: '已注册蓝牙状态监听', icon: 'none' });
}

/** 停止监听蓝牙状态 */
export function offAdapterStateChange() {
  if (guardPC()) return;
  if (stateListener) {
    (wx as any).offBluetoothAdapterStateChange(stateListener);
    stateListener = null;
    wx.showToast({ title: '已停止蓝牙状态监听', icon: 'none' });
  }
}

/** 开始搜索附近蓝牙设备 */
export function startDevicesDiscovery() {
  if (guardPC()) return;
  wx.startBluetoothDevicesDiscovery({
    success() {
      wx.showToast({ title: '已开始搜索附近设备', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `搜索失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 停止搜索 */
export function stopDevicesDiscovery() {
  if (guardPC()) return;
  wx.stopBluetoothDevicesDiscovery({
    success() {
      wx.showToast({ title: '已停止搜索', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `停止搜索失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 获取已发现的设备列表 */
export function getDevices() {
  if (guardPC()) return;
  wx.getBluetoothDevices({
    success(res: any) {
      const list = res.devices || [];
      wx.showToast({ title: `发现 ${list.length} 个设备`, icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `获取失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

export function onUnload() {
  offAdapterStateChange();
}
