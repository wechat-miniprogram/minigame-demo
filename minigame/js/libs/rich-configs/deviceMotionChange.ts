/**
 * deviceMotionChange rich-config
 * alpha/beta/gamma 三轴数值实时显示
 */

import * as logic from '../../api/device/deviceMotionChange/index';
import { createSensorButtons } from './sensor-buttons';
import type { RichConfig } from '../rich-renderer';

let _start: (() => void) | null = null;

export const config: RichConfig = {
  title: '监听设备方向',
  apiName: 'deviceMotionChange',

  buildTopView(PIXI: any, app: any, obj: any, underline: any) {
    const { p_text, p_box } = require('../component/index');
    const baseY = underline ? underline.y + underline.height : 0;

    const div = p_box(PIXI, {
      width: 600 * PIXI.ratio, height: 372 * PIXI.ratio,
      y: baseY + 80 * PIXI.ratio,
    });

    const text = p_text(PIXI, {
      content: 'α：0 rad\nβ：0 rad\nγ：0 rad',
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
      text.turnText(`α：${res.alpha} rad\nβ：${res.beta} rad\nγ：${res.gamma} rad`);
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
