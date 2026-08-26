/**
 * compassChange rich-config
 * 指南针图片随罗盘方向旋转 + 角度数值实时显示
 */

import * as logic from '../../api/device/compassChange/index';
import { createSensorButtons } from './sensor-buttons';
import type { RichConfig } from '../rich-renderer';

let _start: (() => void) | null = null;

export const config: RichConfig = {
  title: '监听罗盘数据',
  apiName: 'compassChange',

  buildTopView(PIXI: any, app: any, obj: any, underline: any) {
    const { p_text, p_box, p_img } = require('../component/index');
    const baseY = underline ? underline.y + underline.height : 0;

    const prompt = p_text(PIXI, {
      content: '旋转手机即可获取方位信息',
      fontSize: 32 * PIXI.ratio, fill: 0xb2b2b2,
      y: baseY + 66.5 * PIXI.ratio,
      relative_middle: { containerWidth: obj.width },
    });

    const imgContainer = p_box(PIXI, {
      width: 540 * PIXI.ratio, height: 540 * PIXI.ratio,
      background: { alpha: 0 }, y: prompt.y + prompt.height + 66.5 * PIXI.ratio,
    });

    const img = p_img(PIXI, {
      width: imgContainer.width, src: 'images/Group 3.png',
      x: imgContainer.width / 2, y: imgContainer.height / 2,
    });
    img.setAnchor(0.5);

    const degreeText = p_text(PIXI, {
      content: '0', fontSize: 160 * PIXI.ratio, fill: 0x353535,
      relative_middle: { containerWidth: img.width, containerHeight: img.height },
    });
    const unitText = p_text(PIXI, {
      content: '°', fontSize: 160 * PIXI.ratio, fill: 0x353535,
      x: degreeText.x + degreeText.width,
      relative_middle: { containerHeight: img.height },
    });

    const needle = p_box(PIXI, {
      width: 6 * PIXI.ratio, height: 56 * PIXI.ratio,
      background: { color: 0x07C160 }, radius: 3 * PIXI.ratio,
      y: -16 * PIXI.ratio, parentWidth: imgContainer.width,
    });
    imgContainer.addChild(img, needle, degreeText, unitText);

    // 互锁按钮
    const btnBaseY = imgContainer.height + imgContainer.y + 142 * PIXI.ratio;
    const { startBtn, stopBtn, start } = createSensorButtons(
      PIXI, obj, btnBaseY,
      logic.startListening,
      logic.stopListening
    );
    _start = start;

    // 绑定罗盘数据
    logic.setOnData((res: any) => {
      img.setRotation((~~res.direction * Math.PI) / 180);
      degreeText.turnText(String(res.direction | 0));
      unitText.setPositionFn({ x: degreeText.x + degreeText.width });
    });

    window.router.getNowPage((page: any) => {
      page.reload = () => { start(); };
    });

    const topContainer = new PIXI.Container();
    topContainer.addChild(prompt, imgContainer, startBtn, stopBtn);
    return topContainer;
  },

  actions: [],

  onLoad: () => _start?.(),
  onUnload: logic.onUnload,
};
