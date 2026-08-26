/**
 * 微信运动
 * wx.getWeRunData
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/we-run/wx.getWeRunData.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatJSON } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取微信运动数据，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'weRun';
/** 是否为 PC 平台（微信运动仅支持移动端） */
function isPC() {
  const { platform } = wx.getSystemInfoSync();
  return platform === 'windows' || platform === 'mac';
}

/** 获取用户最近 30 天的步数，通过云函数自动解密 */
export function getWeRunData() {
  if (isPC()) {
    setInfo('微信运动仅支持移动端，请在手机上体验');
    return;
  }
  wx.getWeRunData({
    success(res: any) {
      const cloudID = res.cloudID;
      if (!cloudID) {
        setInfo(`cloudID 为空，无法通过云函数解密\nencryptedData: ${String(res.encryptedData || '').slice(0, 40)}...\niv: ${res.iv || '-'}`);
        return;
      }
      // 通过云函数使用 CloudID 自动解密
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getWeRunData',
          weRunData: wx.cloud.CloudID(cloudID),
        },
      }).then((resp: any) => {
        const data = resp.result?.weRunData?.data;
        if (data) {
          setInfo(formatJSON(data));
        } else {
          setInfo(formatJSON(resp.result));
        }
      }).catch((err: any) => {
        wx.showToast({ title: `云函数调用失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
      });
    },
    fail(err: any) {
      wx.showToast({ title: `获取失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
