/**
 * 系统信息
 * wx.getSystemInfoSync / wx.getSystemInfo / wx.getSystemInfoAsync / wx.getWindowInfo /
 * wx.getSystemSetting / wx.getDeviceInfo / wx.getDeviceBenchmarkInfo /
 * wx.getAppBaseInfo / wx.getAppAuthorizeSetting /
 * wx.openSystemBluetoothSetting / wx.openAppAuthorizeSetting
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/system/wx.getSystemInfo.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatJSON } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取系统/设备/窗口等信息，返回数据将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'system';
/** 同步获取系统信息 */
export function getSystemInfoSync() {
  const info = wx.getSystemInfoSync();
  setInfo(formatJSON(info));
}

/** 异步获取系统信息（回调风格） */
export function getSystemInfo() {
  wx.getSystemInfo({
    success(res: any) {
      setInfo(formatJSON(res));
    },
    fail(err: any) {
      setInfo(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 异步获取系统信息 */
export function getSystemInfoAsync() {
  wx.getSystemInfoAsync({
    success(res: any) {
      setInfo(formatJSON(res));
    },
    fail(err: any) {
      setInfo(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 获取窗口信息 */
export function getWindowInfo() {
  const info = wx.getWindowInfo();
  setInfo(formatJSON(info));
}

/** 获取设备设置（蓝牙/Wi-Fi/定位等开关） */
export function getSystemSetting() {
  const info = wx.getSystemSetting();
  setInfo(formatJSON(info));
}

/** 获取设备基础信息 */
export function getDeviceInfo() {
  const info = wx.getDeviceInfo();
  setInfo(formatJSON(info));
}

/** 获取设备性能档位 */
export function getDeviceBenchmarkInfo() {
  wx.getDeviceBenchmarkInfo({
    success(res: any) {
      setInfo(formatJSON(res));
    },
    fail(err: any) {
      setInfo(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 获取微信 App 基础信息 */
export function getAppBaseInfo() {
  const info = wx.getAppBaseInfo();
  setInfo(formatJSON(info));
}

/** 获取微信 App 授权设置 */
export function getAppAuthorizeSetting() {
  const info = wx.getAppAuthorizeSetting();
  setInfo(formatJSON(info));
}

/** 跳转系统蓝牙设置页（仅 Android） */
export function openSystemBluetoothSetting() {
  const systemInfo = wx.getSystemInfoSync();
  if (systemInfo.platform !== 'android') {
    wx.showToast({ title: '该功能仅支持安卓', icon: 'none', duration: 1000 });
    return;
  }
  wx.openSystemBluetoothSetting({
    fail(err: any) {
      setInfo(`打开失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 跳转微信授权管理页（仅移动端） */
export function openAppAuthorizeSetting() {
  const systemInfo = wx.getSystemInfoSync();
  if (systemInfo.platform === 'windows' || systemInfo.platform === 'mac') {
    wx.showToast({ title: '该功能仅支持移动端', icon: 'none', duration: 1000 });
    return;
  }
  wx.openAppAuthorizeSetting({
    fail(err: any) {
      setInfo(`打开失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
