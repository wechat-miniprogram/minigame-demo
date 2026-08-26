/**
 * 字符编解码工具
 * wx.encode / wx.decode
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/util/wx.encode.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮对字符串进行编解码，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'encode';
let lastEncoded: ArrayBuffer | null = null;

/** 字符串编码为 ArrayBuffer（UTF-8） */
export function encodeUtf8() {
  const text = 'Hello 小游戏';
  const buf: ArrayBuffer = wx.encode({ data: text, format: 'utf8' });
  lastEncoded = buf;
  setInfo(
    `原文: ${text}\n编码: utf8\n字节长度: ${buf.byteLength}\n十六进制: ${bufToHex(new Uint8Array(buf))}`
  );
}

/** 用上一步的 ArrayBuffer 解码回字符串 */
export function decodeUtf8() {
  if (!lastEncoded) {
    setInfo('请先点 encodeUtf8');
    return;
  }
  const text: string = wx.decode({ data: lastEncoded, format: 'utf8' });
  setInfo(
    `输入字节长度: ${lastEncoded.byteLength}\n解码格式: utf8\n结果: ${text}`
  );
}

function bufToHex(buf: Uint8Array) {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}
