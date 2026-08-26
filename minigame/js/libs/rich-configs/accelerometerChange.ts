/**
 * accelerometerChange rich-config
 * 圆形区域 + 小绿球随加速度移动 + X/Y/Z 数值实时显示
 */

import * as logic from '../../api/device/accelerometerChange/index';
import { createSensorButtons } from './sensor-buttons';
import type { RichConfig } from '../rich-renderer';

let _start: (() => void) | null = null;

export const config: RichConfig = {
  title: '重力感应',
  apiName: 'accelerometerChange',

  buildTopView(PIXI: any, app: any, obj: any, underline: any) {
    const { p_text, p_circle } = require('../component/index');
    const baseY = underline ? underline.y + underline.height : 0;

    const prompt = p_text(PIXI, {
      content: '倾斜手机即可移动下方小球',
      fontSize: 32 * PIXI.ratio, fill: 0xb2b2b2,
      y: baseY + 66.5 * PIXI.ratio,
      relative_middle: { containerWidth: obj.width },
    });

    const circle = p_circle(PIXI, {
      radius: 270 * PIXI.ratio, x: obj.width / 2,
      y: prompt.y + prompt.height + 336.5 * PIXI.ratio,
    });
    const childCircle = p_circle(PIXI, {
      radius: 18 * PIXI.ratio, background: { color: 0x07C160 },
    });
    circle.addChild(childCircle);

    const textX = p_text(PIXI, { content: 'X：0', fontSize: 36 * PIXI.ratio, fill: 0x353535, y: circle.height / 2 + circle.y + 50.5 * PIXI.ratio, relative_middle: { point: obj.width / 5 } });
    const textY = p_text(PIXI, { content: 'Y：0', fontSize: 36 * PIXI.ratio, fill: 0x353535, y: textX.y, relative_middle: { point: obj.width / 2 } });
    const textZ = p_text(PIXI, { content: 'Z：0', fontSize: 36 * PIXI.ratio, fill: 0x353535, y: textX.y, relative_middle: { point: (4 * obj.width) / 5 } });

    // 互锁按钮
    const btnBaseY = circle.height / 2 + circle.y + 189 * PIXI.ratio;
    const { startBtn, stopBtn, start } = createSensorButtons(
      PIXI, obj, btnBaseY,
      logic.startListening,
      logic.stopListening
    );
    _start = start;

    // 绑定传感器数据到 UI 更新
    logic.setOnData((res: any) => {
      textX.turnText('X：' + res.x.toFixed(2));
      textY.turnText('Y：' + res.y.toFixed(2));
      textZ.turnText('Z：' + res.z.toFixed(2));
      const nx = childCircle.x + res.x * 20 * PIXI.ratio;
      const ny = childCircle.y - res.y * 20 * PIXI.ratio;
      if (Math.sqrt(nx * nx + ny * ny) <= (circle.width - childCircle.width) / 2) {
        childCircle.setPositionFn({ x: nx, y: ny });
      }
    });

    // page.reload 绑定（旧版微信不支持 offAccelerometer 时需要）
    window.router.getNowPage((page: any) => {
      page.reload = () => {
        start();
      };
    });

    const topContainer = new PIXI.Container();
    topContainer.addChild(prompt, circle, textX, textY, textZ, startBtn, stopBtn);
    return topContainer;
  },

  // 按钮已在 buildTopView 里创建，actions 为空
  actions: [],

  onLoad: () => _start?.(),
  onUnload: logic.onUnload,
};
