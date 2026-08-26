/**
 * 创建 ImageData 对象
 * wx.createImageData
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/render/image/wx.createImageData.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮创建 ImageData 对象，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'createImageData';

/** 创建 ImageData 并可视化展示 */
export function createImageDataDemo() {
  if (typeof (wx as any).createImageData !== 'function') {
    setInfo('当前环境不支持 wx.createImageData');
    return;
  }
  const imageData = (wx as any).createImageData(100, 100);
  if (!imageData) {
    setInfo('wx.createImageData 调用失败，请确认基础库版本 ≥ 3.4.10或更换设备使用');
    return;
  }

  // 填充渐变色像素，让效果可视化
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const i = (y * imageData.width + x) * 4;
      imageData.data[i] = x * 2.55; // R
      imageData.data[i + 1] = y * 2.55; // G
      imageData.data[i + 2] = 128; // B
      imageData.data[i + 3] = 255; // A
    }
  }

  // 将 ImageData 绘制到离屏 canvas 并展示
  const offCanvas = wx.createCanvas();
  offCanvas.width = 100;
  offCanvas.height = 100;
  const ctx = offCanvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);

  offCanvas.toTempFilePath({
    fileType: 'png',
    quality: 1,
    success(res: any) {
      display.image(res.tempFilePath);
    },
    fail(err: any) {
      setInfo(
        formatObj({
          width: imageData.width,
          height: imageData.height,
          截图失败: err?.errMsg || '未知错误',
        })
      );
    },
  });
}
