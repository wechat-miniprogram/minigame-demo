/**
 * gyroscopeChange rich-config
 * X/Y/Z 三轴角速度数值实时显示
 */

import * as logic from '../../api/device/gyroscopeChange/index';
import { createSensorButtons } from './sensor-buttons';
import type { RichConfig } from '../rich-renderer';

let _start: (() => void) | null = null;

export const config: RichConfig = {
  title: '监听陀螺仪数据',
  apiName: 'gyroscopeChange',

  buildTopView(PIXI: any, app: any, obj: any, underline: any) {
    const { p_text, p_box } = require('../component/index');
    const baseY = underline ? underline.y + underline.height : 0;

    const div = p_box(PIXI, {
      width: 600 * PIXI.ratio, height: 372 * PIXI.ratio,
      y: baseY + 80 * PIXI.ratio,
    });

    const text = p_text(PIXI, {
      content: 'X轴的角速度：0 °/s\nY轴的角速度：0 °/s\nZ轴的角速度：0 °/s',
      fontSize: 30 * PIXI.ratio, align: 'center', fill: 0x353535,
      y: 93 * PIXI.ratio, lineHeight: 72 * PIXI.ratio,
      relative_middle: { containerWidth: div.width },
    });
    div.addChild(text);

    // 互锁按钮
    const btnBaseY = div.height + div.y + 348 * PIXI.ratio;
    const { startBtn, stopBtn, start } = createSensorButtons(
      PIXI, obj, btnBaseY,
      logic.startListening,
      logic.stopListening
    );
    _start = start;

    logic.setOnData((res: any) => {
      text.turnText(
        `X轴的角速度：${res.x.toFixed(3)} °/s\nY轴的角速度：${res.y.toFixed(3)} °/s\nZ轴的角速度：${res.z.toFixed(3)} °/s`
      );
    });

    window.router.getNowPage((page: any) => {
      page.reload = () => { start(); };
    });

    const topContainer = new PIXI.Container();
    topContainer.addChild(div, startBtn, stopBtn);
    return topContainer;
  },

  actions: [],

  onLoad: () => _start?.(),
  onUnload: logic.onUnload,
};
