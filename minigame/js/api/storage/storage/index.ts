/**
 * 数据缓存
 * wx.setStorage / wx.getStorage / wx.removeStorage / wx.clearStorage
 * wx.setStorageSync / wx.getStorageSync / wx.removeStorageSync / wx.clearStorageSync
 * wx.getStorageInfo / wx.getStorageInfoSync
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮对本地缓存进行增删改查，操作结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'storage';
const STORAGE_KEY = 'miniGameDemoData';

/** 存储数据（异步） */
export function setStorage() {
  const data = 'Hello MiniGame! ' + new Date().toLocaleTimeString();
  wx.setStorage({
    key: STORAGE_KEY,
    data,
    success() {
      setInfo(
        formatObj({ key: STORAGE_KEY, value: data, 状态: '已存储' })
      );
    },
    fail(err: any) {
      setInfo(`存储失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 存储数据（同步） */
export function setStorageSync() {
  const data = 'Hello MiniGame! ' + new Date().toLocaleTimeString();
  wx.setStorageSync(STORAGE_KEY, data);
  setInfo(
    formatObj({ key: STORAGE_KEY, value: data, 状态: '已存储(同步)' })
  );
}

/** 读取数据（异步） */
export function getStorage() {
  wx.getStorage({
    key: STORAGE_KEY,
    success(res: any) {
      setInfo(formatObj({ key: STORAGE_KEY, value: String(res.data) }));
    },
    fail() {
      setInfo(formatObj({ key: STORAGE_KEY, value: '（未找到）' }));
    },
  });
}

/** 读取数据（同步） */
export function getStorageSync() {
  const data = wx.getStorageSync(STORAGE_KEY);
  setInfo(
    formatObj({ key: STORAGE_KEY, value: String(data || '（未找到）') })
  );
}

/** 获取存储信息（异步） */
export function getStorageInfo() {
  wx.getStorageInfo({
    success(res: any) {
      setInfo(
        formatObj({
          keys: String(res.keys),
          currentSize: `${res.currentSize} KB`,
          limitSize: `${res.limitSize} KB`,
        })
      );
    },
    fail(err: any) {
      setInfo(`获取存储信息失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 获取存储信息（同步） */
export function getStorageInfoSync() {
  const res = wx.getStorageInfoSync();
  setInfo(
    formatObj({
      keys: String(res.keys),
      currentSize: `${res.currentSize} KB`,
      limitSize: `${res.limitSize} KB`,
    })
  );
}

/** 删除指定 key（异步） */
export function removeStorage() {
  wx.removeStorage({
    key: STORAGE_KEY,
    success() {
      setInfo(formatObj({ key: STORAGE_KEY, 状态: '已删除' }));
    },
    fail(err: any) {
      setInfo(`删除失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 删除指定 key（同步） */
export function removeStorageSync() {
  wx.removeStorageSync(STORAGE_KEY);
  setInfo(formatObj({ key: STORAGE_KEY, 状态: '已删除(同步)' }));
}

/** 清除所有缓存（异步） */
export function clearStorage() {
  wx.clearStorage({
    success() {
      setInfo('已清除全部缓存');
    },
    fail(err: any) {
      setInfo(`清除缓存失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 清除所有缓存（同步） */
export function clearStorageSync() {
  wx.clearStorageSync();
  setInfo('已清除全部缓存(同步)');
}
