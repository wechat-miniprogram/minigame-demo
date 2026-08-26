/**
 * Canvas 基础
 * wx.createCanvas
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/render/canvas/wx.createCanvas.html
 *
 * 注意：主 canvas 已由 game.ts 创建（即模板中的 canvas 变量），这里演示如何
 * 创建一个离屏 canvas 用于离屏渲染、图片合成等场景。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮在 Canvas 上绘制图形，绘制结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'canvas';
let offCanvas: any = null;

/** 创建离屏 canvas，画一个红色矩形并打印尺寸 */
export function createOffscreen() {
  offCanvas = wx.createCanvas();
  offCanvas.width = 200;
  offCanvas.height = 100;
  const ctx = offCanvas.getContext('2d');
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, 200, 100);
  setInfo(
    formatObj({
      width: offCanvas.width,
      height: offCanvas.height,
      contextType: ctx.constructor?.name || '2d',
      操作: '已绘制 200x100 红色矩形',
    })
  );
}

/** 把离屏 canvas 转成临时图片 */
export function toTempFile() {
  if (!offCanvas) {
    setInfo('请先 createOffscreen');
    return;
  }
  offCanvas.toTempFilePath?.({
    fileType: 'png',
    quality: 1,
    success(res: any) {
      setInfo(
        formatObj({
          临时图片: res.tempFilePath,
          操作: '已生成 PNG',
        })
      );
    },
    fail(err: any) {
      setInfo(`生成失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 预览该图片 */
export function previewOffscreen() {
  if (!offCanvas) {
    setInfo('请先 createOffscreen');
    return;
  }
  offCanvas.toTempFilePath?.({
    success(res: any) {
      display.image(res?.tempFilePath);
    },
    fail(err: any) {
      setInfo(`预览失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

export function onUnload() {
  offCanvas = null;
}
