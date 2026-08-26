/**
 * 人脸检测
 * wx.requestFacialRecognition / wx.requestFacialVerify /
 * wx.checkIsSupportFacialRecognition
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/facial/wx.requestFacialRecognition.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/facial/wx.requestFacialVerify.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/facial/wx.checkIsSupportFacialRecognition.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮检查/发起人脸识别验证。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'facial';
/** 检查是否支持人脸识别 */
export function checkIsSupportFacialRecognition() {
  if (typeof (wx as any).checkIsSupportFacialRecognition !== 'function') {
    wx.showToast({ title: '当前设备不支持 checkIsSupportFacialRecognition', icon: 'none' });
    return;
  }
  (wx as any).checkIsSupportFacialRecognition({
    success() {
      wx.showToast({ title: '支持人脸识别', icon: 'none' });
    },
    fail() {
      wx.showToast({ title: '不支持人脸识别', icon: 'none' });
    },
  });
}

/** 请求人脸核验（verifyId 需从服务端获取） */
export function requestFacialVerify() {
  if (typeof (wx as any).requestFacialVerify !== 'function') {
    wx.showToast({ title: '当前设备不支持 requestFacialVerify', icon: 'none' });
    return;
  }
  (wx as any).requestFacialVerify({
    verifyId: '',
    success(res: any) {
      wx.showToast({ title: `人脸核验结果: ${res?.errMsg || '成功'}`, icon: 'none' });
    },
    fail(err: any) {
      setTimeout(() => {
        wx.showToast({ title: `人脸核验失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
      }, 2000);
    },
  });
}
