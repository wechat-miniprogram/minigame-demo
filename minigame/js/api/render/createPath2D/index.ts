/**
 * 创建 Path2D 对象
 * wx.createPath2D
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/render/canvas/wx.createPath2D.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮创建 Path2D 路径并绘制，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'createPath2D';
/** 创建离屏 canvas 并绘制，drawFn 返回 false 表示绘制失败，跳过截图 */
function drawOnOffscreen(drawFn: (ctx: any, canvas: any) => boolean) {
  const offCanvas = wx.createCanvas();
  offCanvas.width = 200;
  offCanvas.height = 150;
  const ctx = offCanvas.getContext('2d');
  ctx.clearRect(0, 0, 200, 150);

  const ok = drawFn(ctx, offCanvas);
  if (!ok) return;

  offCanvas.toTempFilePath({
    fileType: 'png',
    quality: 1,
    success(res: any) {
      display.image(res.tempFilePath);
    },
    fail(err: any) {
      setInfo(`截图失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 创建 Path2D 并绘制矩形和弧形路径 */
export function createPath2D() {
  drawOnOffscreen((ctx: any) => {
    const path = (wx as any).createPath2D?.();
    if (!path) {
      setInfo('wx.createPath2D 调用失败，请确认基础库版本 ≥ 2.24.6');
      return false;
    }
    path.rect(10, 10, 100, 50);
    path.arc(60, 85, 40, 0, Math.PI * 2);
    ctx.strokeStyle = '#07c160';
    ctx.lineWidth = 2;
    ctx.stroke(path);
    return true;
  });
}

/** 添加路径指令绘制三角形 */
export function addPathCommand() {
  drawOnOffscreen((ctx: any) => {
    const path = (wx as any).createPath2D?.();
    if (!path) {
      setInfo('wx.createPath2D 调用失败，请确认基础库版本 ≥ 2.24.6');
      return false;
    }
    path.moveTo(10, 10);
    path.lineTo(180, 10);
    path.lineTo(180, 130);
    path.closePath();
    ctx.fillStyle = '#ff6600';
    ctx.fill(path);
    return true;
  });
}
