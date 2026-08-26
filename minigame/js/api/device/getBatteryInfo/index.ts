/**
 * 电量
 * wx.getBatteryInfo
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取设备电量信息，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'getBatteryInfo';

/** 获取设备电量信息 */
export function getBatteryInfo() {
  wx.getBatteryInfo({
    success(res: any) {
      setInfo(
        `当前电量: ${res.level}%\n电池状态: ${res.isCharging ? '充电中' : '未充电'}`
      );
    },
    fail(err: any) {
      setInfo(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
