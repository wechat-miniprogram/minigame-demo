/**
 * 获取位置
 * wx.getLocation / wx.getFuzzyLocation
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取当前地理位置信息，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'getLocation';

/** 获取当前地理位置（精确） */
export function getLocation() {
  wx.getLocation({
    type: 'gcj02',
    success(res: any) {
      setInfo(
        `经度 E: ${res.longitude.toFixed(6)}\n纬度 N: ${res.latitude.toFixed(6)}\n速度: ${res.speed} m/s`
      );
    },
    fail(err: any) {
      setInfo(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 获取模糊位置（无需用户授权） */
export function getFuzzyLocation() {
  if (typeof (wx as any).getFuzzyLocation !== 'function') {
    setInfo('当前环境不支持 wx.getFuzzyLocation');
    return;
  }
  (wx as any).getFuzzyLocation({
    success(res: any) {
      setInfo(
        `经度 E: ${res.longitude.toFixed(6)}\n纬度 N: ${res.latitude.toFixed(6)}\n类型: 模糊位置`
      );
    },
    fail(err: any) {
      setInfo(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
