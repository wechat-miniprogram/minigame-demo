/**
 * screenBrightness rich-config
 * 大字显示当前亮度值 + 滑块拖动调节亮度
 */

import * as logic from '../../api/device/screenBrightness/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '屏幕亮度',
  apiName: 'screenBrightness',

  buildTopView(PIXI: any, app: any, obj: any, underline: any) {
    const { p_text, p_box, p_circle } = require('../component/index');
    const baseY = underline ? underline.y + underline.height : 0;

    const div = p_box(PIXI, {
      height: 474.4 * PIXI.ratio, y: baseY + 80 * PIXI.ratio,
    });

    const valueText = p_text(PIXI, {
      content: '', fontSize: 72 * PIXI.ratio,
      y: 225 * PIXI.ratio, relative_middle: { containerWidth: div.width },
    });

    div.addChild(
      p_text(PIXI, {
        content: '当前屏幕亮度', fontSize: 34 * PIXI.ratio,
        y: 54 * PIXI.ratio, relative_middle: { containerWidth: div.width },
      }),
      valueText,
      p_text(PIXI, {
        content: '设置屏幕亮度', fontSize: 28 * PIXI.ratio, fill: 0x9f9f9f,
        x: 46 * PIXI.ratio, y: div.height + 36.6 * PIXI.ratio,
      })
    );

    // 滑块
    const grayLine = p_box(PIXI, {
      width: 580 * PIXI.ratio, height: 4 * PIXI.ratio, radius: 2 * PIXI.ratio,
      background: { color: 0xb5b6b5 }, y: div.y + div.height + 49 * PIXI.ratio,
    });
    const greenLine = p_box(PIXI, {
      width: grayLine.width, height: grayLine.height, radius: 2 * PIXI.ratio,
      background: { color: 0x07C160 }, y: grayLine.y,
    });
    const circle = p_circle(PIXI, {
      radius: 20 * PIXI.ratio, background: { color: 0x07C160 },
      x: greenLine.x, y: greenLine.y + greenLine.height / 2,
    });
    greenLine.width = 0;

    circle.onTouchMoveFn((e: any) => {
      if (e.data.global.x >= grayLine.x && grayLine.x + grayLine.width >= e.data.global.x) {
        circle.setPositionFn({ x: e.data.global.x });
        greenLine.width = e.data.global.x - greenLine.x;
        const value = Math.round((greenLine.width / grayLine.width) * 10) / 10;
        logic.setScreenBrightness(value);
      }
    });

    // 亮度变化时更新文字和滑块位置（包括初始化时的 getScreenBrightness 回调）
    logic.setOnBrightnessChange((value: number) => {
      valueText.turnText(String(Math.round(value * 10) / 10));
      circle.setPositionFn({ x: greenLine.x + (greenLine.width = grayLine.width * value) });
    });

    const topContainer = new PIXI.Container();
    topContainer.addChild(div, grayLine, greenLine, circle);
    // circle.touchmove 由 rich-renderer 的 container.touchend 清理
    return topContainer;
  },

  actions: [],

  // 页面打开时立即获取当前亮度，触发 onBrightnessChange 回调初始化滑块位置
  onLoad: logic.getScreenBrightness,
  onUnload: logic.onUnload,
};
