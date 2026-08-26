/**
 * BufferURL（把内存 buffer 当作 URL 喂给 image / audio 等）
 * wx.createBufferURL / wx.revokeBufferURL
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/storage/wx.createBufferURL.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮创建/预览/销毁 BufferURL，操作结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'bufferUrl';
const SAMPLE_URL =
  'https://mmgame.qpic.cn/image/50e4b673d8b0743ba48ce2a8b5e655b12ca05f9e0b530650d2dfd8e64c53ee31/0';
let bufUrl = '';

/** 下载图片到 ArrayBuffer，再用 createBufferURL 包装成 URL */
export function createBufferURL() {
  setInfo('下载图片中...');
  wx.request({
    url: SAMPLE_URL,
    responseType: 'arraybuffer',
    success(res: any) {
      if (typeof wx.createBufferURL !== 'function') {
        setInfo('当前版本不支持 createBufferURL');
        return;
      }
      bufUrl = wx.createBufferURL(res.data);
      setInfo(
        formatObj({
          size: `${res.data.byteLength} B`,
          bufferUrl: bufUrl,
        })
      );
    },
    fail(err: any) {
      setInfo(`下载失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 用 BufferURL 展示图片 */
export function previewBufferUrl() {
  if (!bufUrl) {
    setInfo('请先 createBufferURL');
    return;
  }
  display.image(bufUrl);
}

/** 释放 BufferURL */
export function revokeBufferURL() {
  if (bufUrl && typeof wx.revokeBufferURL === 'function') {
    wx.revokeBufferURL(bufUrl);
    bufUrl = '';
    setInfo('已 revoke');
  }
}

export function onUnload() {
  revokeBufferURL();
}
