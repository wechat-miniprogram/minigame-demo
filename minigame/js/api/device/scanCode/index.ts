/**
 * 扫码
 * wx.scanCode
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/scan/wx.scanCode.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮调起扫码功能，扫码结果通过 Toast 提示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'scanCode';

/** 调起扫码（相机 + 相册皆可） */
export function scanCode() {
  wx.scanCode({
    success(res: any) {
      wx.showToast({ title: `扫码结果: ${res.result}`, icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `扫码失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 仅相机扫码（onlyFromCamera:true） */
export function scanCodeCameraOnly() {
  wx.scanCode({
    onlyFromCamera: true,
    scanType: ['qrCode', 'barCode'],
    success(res: any) {
      wx.showToast({ title: `扫码结果: ${res.result}`, icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `扫码失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
