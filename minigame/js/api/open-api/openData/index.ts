/**
 * 开放数据（主域可调用部分）
 *
 * 以下 API 可在主域直接调用：
 *   wx.setUserCloudStorage   - 上报用户托管数据
 *   wx.removeUserCloudStorage - 删除用户托管数据
 *   wx.getUserInteractiveStorage - 获取用户互动数据（需真机，返回加密数据）
 *   wx.onInteractiveStorageModified - 监听互动数据修改（需真机）
 *   wx.offInteractiveStorageModified - 取消监听互动数据修改（需真机）
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取开放数据（好友排行/群排行等）。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'openData';
function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

let interactiveFn: any = null;

// ===== 托管数据 =====

/** 上报用户托管数据 */
export function setUserCloudStorage() {
  const score = Math.floor(Math.random() * 1000 + 1);
  wx.setUserCloudStorage({
    KVDataList: [
      {
        key: 'score',
        value: JSON.stringify({
          wxgame: {
            score,
            update_time: parseInt(String(+new Date() / 1000)),
          },
        }),
      },
    ],
    success() {
      toast(`上报成功，分数: ${score}`);
    },
    fail(err: any) {
      toast(`上报失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 删除用户托管数据（主域和子域均可调用） */
export function removeUserCloudStorage() {
  wx.removeUserCloudStorage({
    keyList: ['score'],
    success() {
      toast('已删除 score 托管数据');
    },
    fail(err: any) {
      toast(`删除失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

// ===== 互动数据 =====

/** 获取用户互动数据（主域可调用，需真机） */
export function getUserInteractiveStorage() {
  if (typeof (wx as any).getUserInteractiveStorage !== 'function') {
    toast('此 API 需在真机上测试');
    return;
  }
  (wx as any).getUserInteractiveStorage({
    keyList: ['1'],
    success(res: any) {
      toast(`iv: ${res.iv} | encryptedData: ${res.encryptedData}`);
    },
    fail(err: any) {
      toast(`获取失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 监听互动数据修改（主域可调用，需真机） */
export function onInteractiveStorageModified() {
  if (typeof (wx as any).onInteractiveStorageModified !== 'function') {
    toast('此 API 需在真机上测试');
    return;
  }
  interactiveFn = (res: any) => {
    toast(`onInteractiveStorageModified | openId: ${res.openId ?? '-'}`);
  };
  (wx as any).onInteractiveStorageModified(interactiveFn);
  toast('已监听互动数据修改事件');
}

/** 取消监听互动数据修改（主域可调用，需真机） */
export function offInteractiveStorageModified() {
  if (typeof (wx as any).offInteractiveStorageModified !== 'function') {
    toast('此 API 需在真机上测试');
    return;
  }
  if (interactiveFn) {
    (wx as any).offInteractiveStorageModified(interactiveFn);
    interactiveFn = null;
    toast('已取消监听互动数据修改');
  } else {
    toast('当前无监听，无需取消');
  }
}

export function onUnload() {
  if (interactiveFn) {
    (wx as any).offInteractiveStorageModified?.(interactiveFn);
    interactiveFn = null;
  }
}
