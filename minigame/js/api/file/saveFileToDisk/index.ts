/**
 * 保存文件到本机（PC 端）
 * wx.saveFileToDisk
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮保存文件到磁盘。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'saveFileToDisk';

const SAMPLE_URL = 'https://res.wx.qq.com/wxa-game/dev_doc/images/cover.jpg';

function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

/** 下载一张图片，再保存到 PC 本机（仅 PC 微信生效） */
export function saveFileToDisk() {
  toast('下载中...');
  wx.downloadFile({
    url: SAMPLE_URL,
    success(d: any) {
      if (typeof wx.saveFileToDisk !== 'function') {
        toast('当前版本不支持 saveFileToDisk（仅 PC 端）');
        return;
      }
      wx.saveFileToDisk({
        filePath: d.tempFilePath,
        success() {
          toast('已保存到本机');
        },
        fail(err: any) {
          toast(`保存失败: ${err?.errMsg || '未知错误'}`);
        },
      });
    },
    fail(err: any) {
      toast(`下载失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}
