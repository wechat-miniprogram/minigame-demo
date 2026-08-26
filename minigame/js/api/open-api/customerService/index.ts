/**
 * 客服消息
 * wx.openCustomerServiceConversation
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/customer-message/wx.openCustomerServiceConversation.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮打开客服会话，操作结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'customerService';
/** 打开客服会话 */
export function openCustomerService() {
  wx.openCustomerServiceConversation({
    sessionFrom: 'demo',
    success() {
    },
    fail(err: any) {
      setInfo(`打开失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
