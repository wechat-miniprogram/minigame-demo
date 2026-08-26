/**
 * 帧回调
 * requestAnimationFrame / cancelAnimationFrame
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/render/frame/requestAnimationFrame.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮启动/停止动画帧回调，帧率信息将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'animationFrame';
let frameId: number | null = null;
let frameCount = 0;
let startTime = 0;

/** requestAnimationFrame 请求下一帧回调 */
export function requestAnimationFrameDemo() {
  frameCount = 0;
  startTime = Date.now();

  function onFrame() {
    frameCount++;
    const elapsed = Date.now() - startTime;
    if (elapsed < 3000) {
      frameId = requestAnimationFrame(onFrame);
      setInfo(
        formatObj({
          已执行帧数: frameCount,
          耗时: elapsed + 'ms',
          状态: '进行中',
        })
      );
    } else {
      setInfo(
        formatObj({
          总帧数: frameCount,
          总耗时: elapsed + 'ms',
          状态: '已结束（3秒）',
        })
      );
      frameId = null;
    }
  }

  frameId = requestAnimationFrame(onFrame);
  setInfo('已请求 requestAnimationFrame');
}

/** cancelAnimationFrame 取消帧回调 */
export function cancelAnimationFrameDemo() {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    setInfo(
      formatObj({
        已取消帧ID: frameId,
        已执行帧数: frameCount,
        状态: '已取消',
      })
    );
    frameId = null;
  } else {
    setInfo('当前没有正在进行的动画帧');
  }
}

/** 页面销毁时取消动画 */
export function onUnload() {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }
}
