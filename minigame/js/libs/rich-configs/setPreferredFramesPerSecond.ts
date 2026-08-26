/**
 * setPreferredFramesPerSecond rich-config
 * 旋转三角形动画 + 滑块调节帧率 + 实时帧率显示
 */

import * as logic from '../../api/render/setPreferredFramesPerSecond/index';
import type { RichConfig } from '../rich-renderer';

let _removeTicker: (() => void) | null = null;

export const config: RichConfig = {
  title: '渲染帧率',
  apiName: 'setPreferredFramesPerSecond',

  buildTopView(PIXI: any, app: any, obj: any, underline: any) {
    const { p_box, p_circle, p_text } = require('../component/index');

    const baseY = underline ? underline.y + underline.height : 0;

    const box = p_box(PIXI, {
      height: 372 * PIXI.ratio,
      y: baseY + 23 * PIXI.ratio,
    });

    const fpsText = p_text(PIXI, {
      content: '当前帧率：60fps', fontSize: 30 * PIXI.ratio, fill: 0x353535,
      y: 307 * PIXI.ratio, relative_middle: { containerWidth: box.width },
    });

    // 旋转三角形
    const bw = box.width;
    const circumR = (Math.sqrt(3) * bw / 6) ** 3 / (4 * (bw / 4) * Math.sqrt(3) * (bw / 12));
    const trilateral = new PIXI.Graphics();
    trilateral.beginFill(0x07C160).drawPolygon([
      -(Math.sqrt(3) * (bw / 12)), bw / 4 - circumR,
      Math.sqrt(3) * (bw / 12), bw / 4 - circumR,
      0, -circumR,
    ]).endFill();
    trilateral.position.set(bw / 2, box.height / 2.5);
    trilateral.scale.set(0.9, 0.9);

    let angle = 0;
    function rotatingFn() {
      if (angle > 360) angle -= 360;
      angle += 90 / logic.currentFPS;
      trilateral.rotation = (angle * Math.PI) / 180;
      if ((wx as any).reportPerformance) (wx as any).reportPerformance(2002, logic.currentFPS);
    }
    app.ticker.add(rotatingFn);
    _removeTicker = () => app.ticker.remove(rotatingFn);

    box.addChild(
      trilateral,
      fpsText,
      p_text(PIXI, {
        content: '设置渲染帧率', fontSize: 28 * PIXI.ratio, fill: 0x9f9f9f,
        x: 46 * PIXI.ratio, y: box.height + 36.6 * PIXI.ratio,
      })
    );

    // 滑块
    const grayLine = p_box(PIXI, {
      width: 580 * PIXI.ratio, height: 4 * PIXI.ratio, radius: 2 * PIXI.ratio,
      background: { color: 0xb5b6b5 }, y: box.y + box.height + 49 * PIXI.ratio,
    });
    const greenLine = p_box(PIXI, {
      width: grayLine.width, height: grayLine.height, radius: 2 * PIXI.ratio,
      background: { color: 0x07C160 }, y: grayLine.y,
    });
    const circle = p_circle(PIXI, {
      radius: 20 * PIXI.ratio, background: { color: 0x07C160 },
      x: greenLine.x + greenLine.width, y: greenLine.y + greenLine.height / 2,
    });

    circle.onTouchMoveFn((e: any) => {
      if (e.data.global.x >= grayLine.x && grayLine.x + grayLine.width >= e.data.global.x) {
        circle.setPositionFn({ x: e.data.global.x });
        greenLine.width = e.data.global.x - greenLine.x;
        const fps = 1 + Math.round(59 * (greenLine.width / grayLine.width));
        logic.setFPS(fps);
      }
    });

    // 帧率变化时更新文字
    logic.setOnFPSChange((fps: number) => {
      fpsText.turnText(`当前帧率：${fps}fps`);
    });

    const topContainer = new PIXI.Container();
    topContainer.addChild(
      box, grayLine, greenLine, circle,
      p_text(PIXI, { content: '1', fontSize: 30 * PIXI.ratio, y: grayLine.y + grayLine.height + 54 * PIXI.ratio, relative_middle: { point: grayLine.x } }),
      p_text(PIXI, { content: '60', fontSize: 30 * PIXI.ratio, y: grayLine.y + grayLine.height + 54 * PIXI.ratio, relative_middle: { point: grayLine.x + grayLine.width } }),
    );
    return topContainer;
  },

  actions: [],

  onUnload(app: any) {
    // 停止旋转动画，恢复 60fps
    if (_removeTicker) { _removeTicker(); _removeTicker = null; }
    logic.onUnload();
  },
};
