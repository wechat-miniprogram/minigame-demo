/**
 * 游戏对局回放 rich-config
 * 旋转三角形录制指示器 + 默认绿色按钮列表
 */

import * as logic from '../../api/game-recorder/getGameRecorder/index';
import type { RichConfig } from '../rich-renderer';

// 模块级变量：存储旋转动画函数，供 onUnload 清理
let rotatingFn: (() => void) | null = null;
// 存储 app 引用，供 onUnload 移除 ticker（router 传 null 时仍可清理）
let tickerApp: any = null;

export const config: RichConfig = {
  title: '游戏对局回放',
  apiName: 'getGameRecorder',

  // 透传信息展示区
  infoArea: logic.infoArea,
  onInfoTextReady: logic.onInfoTextReady,

  buildTopView(PIXI: any, app: any, obj: any, underline: any) {
    const { p_box } = require('../component/index');
    const root = new PIXI.Container();

    const baseY = underline ? underline.y + underline.height : 0;

    // ========== 旋转三角形录制指示器（对齐旧版 view.js） ==========
    const box = p_box(PIXI, {
      height: 372 * PIXI.ratio,
      y: baseY + 24.4 * PIXI.ratio,
    });
    root.addChild(box);

    // 外接圆半径计算（对齐旧版）
    const s = Math.sqrt(3) * box.width / 6;
    const circumscribedRadius = (s * s * s) / (4 * (box.width / 4) * (Math.sqrt(3) * (box.width / 12)));

    const trilateral = new PIXI.Graphics();
    trilateral
      .beginFill(0x07C160)
      .drawPolygon([
        -(Math.sqrt(3) * (box.width / 12)),
        box.width / 4 - circumscribedRadius,
        Math.sqrt(3) * (box.width / 12),
        box.width / 4 - circumscribedRadius,
        0,
        -circumscribedRadius,
      ])
      .endFill();
    trilateral.position.set(box.width / 2, box.height / 2);
    trilateral.scale.set(1.15, 1.15);
    box.addChild(trilateral);

    // 旋转动画
    let angle = 0;
    tickerApp = app;
    rotatingFn = () => {
      if (!trilateral || trilateral.destroyed) return;
      if (angle >= 360) angle = 5;
      angle += 5;
      trilateral.rotation = (angle * Math.PI) / 180;
    };
    app.ticker.add(rotatingFn);

    // ========== 计算原生分享按钮位置（放在 operateGameRecorderVideo 按钮下方） ==========
    // rich-renderer 按钮布局：baseY = max(topViewBottom + 40*ratio, underlineBottom + 80*ratio)
    // topViewBottom = box.y + box.height = underlineBottom + 24.4*ratio + 372*ratio = underlineBottom + 396.4*ratio
    // scrollBaseY = underlineBottom + 436.4*ratio (436.4 > 80)
    // 按钮参数：btnW=580*ratio, btnH=80*ratio, btnGap=20*ratio
    // 第7个按钮（index=6）的 y = scrollBaseY + 6*(btnH+btnGap) = scrollBaseY + 600*ratio
    const topViewBottom = baseY + 24.4 * PIXI.ratio + 372 * PIXI.ratio;
    const scrollBaseY = Math.max(topViewBottom + 40 * PIXI.ratio, baseY + 80 * PIXI.ratio);
    const btnW = 580 * PIXI.ratio;
    const btnH = 80 * PIXI.ratio;
    const btnGap = 20 * PIXI.ratio;
    const shareBtnIndex = 6; // 6 个 action 按钮之后
    const shareBtnPixiY = scrollBaseY + shareBtnIndex * (btnH + btnGap);
    const shareBtnPixiX = (obj.width - btnW) / 2;
    // 转换为原生组件坐标（CSS 像素）
    logic.setShareButtonStyle({
      left: shareBtnPixiX / obj.pixelRatio,
      top: shareBtnPixiY / obj.pixelRatio,
      width: btnW / obj.pixelRatio,
      height: btnH / obj.pixelRatio,
    });

    return root;
  },

  // 默认绿色按钮列表
  actions: [
    { label: 'startGameRecord', handler: () => logic.startGameRecord() },
    { label: 'pause', handler: () => logic.pause() },
    { label: 'resume', handler: () => logic.resume() },
    { label: 'stopGameRecord', handler: () => logic.stopGameRecord() },
    { label: 'abort', handler: () => logic.abort() },
    { label: 'operateGameRecorderVideo', handler: () => logic.operateGameRecorderVideo() },
  ],

  onLoad: logic.onLoad,

  onUnload() {
    // 清理旋转动画（router 传 null，用闭包保存的 tickerApp）
    const ticker = tickerApp?.ticker;
    if (rotatingFn && ticker) {
      ticker.remove(rotatingFn);
    }
    rotatingFn = null;
    tickerApp = null;
    logic.onUnload();
  },
};
