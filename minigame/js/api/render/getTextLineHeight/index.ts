/**
 * 获取文本行高
 * wx.getTextLineHeight
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/render/font/wx.getTextLineHeight.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取文本行高，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'getTextLineHeight';

/** 获取文本行高 */
export function getTextLineHeight() {
  if (typeof (wx as any).getTextLineHeight !== 'function') {
    setInfo('当前环境不支持 wx.getTextLineHeight');
    return;
  }
  const lineHeight = (wx as any).getTextLineHeight({
    fontSize: 24,
    fontFamily: 'sans-serif',
    text: 'Hello 微信小游戏',
  });
  setInfo(
    formatObj({
      lineHeight: lineHeight,
      fontSize: 24,
      fontFamily: 'sans-serif',
      text: 'Hello 微信小游戏',
    })
  );
}
