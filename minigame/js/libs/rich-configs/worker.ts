/**
 * worker rich-config
 * 星空动画背景 + 滑块选择 fibonacci 位数 + 并排两个按钮（单线程 vs Worker）
 *
 * 注意：此 config 的 actions 故意为空 —— 两个按钮由 buildTopView 自己画（并排布局），
 * 不走 rich-renderer 的默认垂直按钮列表。原因：原版的演示效果要求两个按钮并排，
 * 方便开发者直观对比「单线程卡顿 vs Worker 流畅」。
 */

import * as logic from '../../api/worker/index';
import type { RichConfig } from '../rich-renderer';

let _removeDelta: (() => void) | null = null;

export const config: RichConfig = {
  title: '多线程',
  apiName: 'worker',
  background: 0x000000,

  buildTopView(PIXI: any, app: any, obj: any, underline: any) {
    const { p_box, p_circle, p_text, p_button } = require('../component/index');

    // 星空背景铺满整个页面
    const background = p_box(PIXI, { width: obj.width, height: obj.height, background: { color: 0x000000 } });

    let cameraZ = 0, speed = 0, warpSpeed = 0, time = 0;
    const starAmount = 1000, fov = 20, baseSpeed = 0.025, starStretch = 5, starBaseSize = 0.05;
    const stars: any[] = [];

    function randomizeStar(star: any, initial?: boolean) {
      star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;
      const deg = Math.random() * Math.PI * 2;
      const dist = Math.random() * 50 + 1;
      star.x = Math.cos(deg) * dist;
      star.y = Math.sin(deg) * dist;
    }

    // 使用 PIXI.Texture.from 替代 PIXI.loader.resources[].texture
    // 原因：loader.resources 在页面二次进入时 texture.baseTexture 可能为 null
    // （loader 只在启动时加载一次，退出后资源状态可能异常）
    const starTexture = PIXI.Texture.from('images/star.png');

    for (let i = 0; i < starAmount; i++) {
      const star = {
        sprite: new PIXI.Sprite(starTexture),
        z: 0, x: 0, y: 0,
      };
      star.sprite.anchor.x = 0.5;
      star.sprite.anchor.y = 0.7;
      randomizeStar(star, true);
      background.addChild(star.sprite);
      stars.push(star);
    }

    function delta(d: number) {
      if ((time += d) >= 300) { warpSpeed = warpSpeed > 0 ? 0 : 1; time = 0; }
      speed += (warpSpeed - speed) / 20;
      cameraZ += d * 20 * (speed + baseSpeed) * (warpSpeed || 10);
      for (const star of stars) {
        if (star.z < cameraZ) randomizeStar(star);
        const z = star.z - cameraZ;
        star.sprite.x = star.x * (fov / z) * app.renderer.screen.width + app.renderer.screen.width / 2;
        star.sprite.y = star.y * (fov / z) * app.renderer.screen.width + app.renderer.screen.height / 2;
        const dxc = star.sprite.x - app.renderer.screen.width / 2;
        const dyc = star.sprite.y - app.renderer.screen.height / 2;
        const dc = Math.sqrt(dxc * dxc + dyc * dyc);
        const ds = Math.max(0, (2000 - z) / 2000);
        star.sprite.scale.x = ds * starBaseSize;
        star.sprite.scale.y = ds * starBaseSize + (ds * speed * starStretch * dc) / app.renderer.screen.width;
        star.sprite.rotation = Math.atan2(dyc, dxc) + Math.PI / 2;
      }
    }
    app.ticker.add(delta);
    _removeDelta = () => app.ticker.remove(delta);

    // 提示文字框（页面下方）
    const box = p_box(PIXI, {
      width: obj.width - 60 * PIXI.ratio, height: 180 * PIXI.ratio,
      radius: 10 * PIXI.ratio, y: obj.height - 340 * PIXI.ratio,
    });

    const fabonacciText = p_text(PIXI, {
      content: `计算斐波拉契数列第${logic.fabonacciIndex}个数的值`,
      fontSize: 28 * PIXI.ratio, fill: 0x333333,
      x: 30 * PIXI.ratio, y: box.height - 50 * PIXI.ratio,
    });

    box.addChild(
      p_text(PIXI, {
        content: '提示: 使用单线程进行计算时，动画会出现明显的\n卡顿现象。使用 Worker 线程进行计算，则可以保\n证动画的流畅。',
        fontSize: 28 * PIXI.ratio, fill: 0xbebebe,
        y: 20 * PIXI.ratio, relative_middle: { containerWidth: box.width },
      }),
      fabonacciText
    );

    // 滑块（在提示框上方）
    const transparentLine = p_box(PIXI, {
      width: 580 * PIXI.ratio, height: 4 * PIXI.ratio,
      radius: 2 * PIXI.ratio, background: { alpha: 0 },
      y: box.y - 100 * PIXI.ratio,
    });
    const whiteLine = p_box(PIXI, {
      width: 35 * (transparentLine.width / 42), height: transparentLine.height,
      radius: 2 * PIXI.ratio, x: transparentLine.x, y: transparentLine.y,
    });
    const circle = p_circle(PIXI, {
      radius: 20 * PIXI.ratio, background: { color: 0xffffff },
      x: whiteLine.x + whiteLine.width, y: whiteLine.y + whiteLine.height / 2,
    });

    circle.onTouchMoveFn((e: any) => {
      const touchX = e.data.global.x;
      const touchY = e.data.global.y;
      // 限制 y 坐标在滑块附近（±80px），避免远处触摸影响滑块
      const sliderY = transparentLine.y;
      if (touchX >= transparentLine.x && touchX <= transparentLine.x + transparentLine.width
        && Math.abs(touchY - sliderY) < 80 * PIXI.ratio) {
        circle.setPositionFn({ x: touchX });
        whiteLine.width = touchX - whiteLine.x;
        const idx = 1 + Math.round(41 * (whiteLine.width / transparentLine.width));
        logic.setFabonacciIndex(idx);
        fabonacciText.turnText(`计算斐波拉契数列第${idx}个数的值`);
      }
    });

    // 滑块范围标注（白色文字，因背景是黑色）
    // 注意：label 作为 box 的子节点，y 必须用相对 box 的坐标（负数在 box 上方）
    // 不能用绝对坐标，否则 PIXI 的 box.height getter 会根据子节点 bounds 把 box 撑爆，
    // 进而把按钮推到屏幕外
    const label1 = p_text(PIXI, {
      content: '1', fontSize: 30 * PIXI.ratio, fill: 0xffffff,
      y: -60 * PIXI.ratio,
      relative_middle: { point: transparentLine.x - box.x },
    });
    const label42 = p_text(PIXI, {
      content: '42', fontSize: 30 * PIXI.ratio, fill: 0xffffff,
      y: -60 * PIXI.ratio,
      relative_middle: { point: transparentLine.x + transparentLine.width - box.x },
    });
    box.addChild(label1, label42);

    // ============ 两个并排按钮（放在屏幕垂直中心）============
    const btnWidth = 335 * PIXI.ratio;
    const btnHeight = 80 * PIXI.ratio;
    const btnY = (obj.height - btnHeight) / 2;

    // 单线程按钮（左）
    const singleBtn = p_button(PIXI, {
      width: btnWidth, height: btnHeight, color: 0x07c160,
      x: 30 * PIXI.ratio, y: btnY,
    });
    singleBtn.myAddChildFn(
      p_text(PIXI, {
        content: '单线程计算',
        fontSize: 30 * PIXI.ratio, fill: 0xffffff, fontWeight: 'normal',
        relative_middle: { containerWidth: singleBtn.width, containerHeight: singleBtn.height },
      })
    );
    singleBtn.onClickFn(() => {
      try { logic.mainThreadFib(); } catch (e: any) {
        wx.showModal({ title: '错误', content: e.errMsg || String(e), showCancel: false });
      }
    });

    // Worker 按钮（右）
    const workerBtn = p_button(PIXI, {
      width: btnWidth, height: btnHeight, color: 0x07c160,
      x: obj.width - btnWidth - 30 * PIXI.ratio, y: btnY,
    });
    workerBtn.myAddChildFn(
      p_text(PIXI, {
        content: 'Worker 线程计算',
        fontSize: 30 * PIXI.ratio, fill: 0xffffff, fontWeight: 'normal',
        relative_middle: { containerWidth: workerBtn.width, containerHeight: workerBtn.height },
      })
    );
    workerBtn.onClickFn(() => {
      try { logic.workerFib(); } catch (e: any) {
        wx.showModal({ title: '错误', content: e.errMsg || String(e), showCancel: false });
      }
    });

    // 绑定结果回调：统一用 showModal 展示计算结果
    logic.setOnResult((result: number) => {
      wx.showModal({ title: '计算结果', content: String(result), showCancel: false });
    });

    // 星星和 UI 元素都加到 background，但按钮单独放外层 Container
    // 原因：p_box 是 PIXI.Graphics 派生，addChild(Container 类型的按钮) 在某些
    // PIXI 版本下渲染会失效，必须和 background 平级才能显示
    background.addChild(box, transparentLine, whiteLine, circle);

    const wrapper = new PIXI.Container();
    wrapper.addChild(background, singleBtn, workerBtn);
    return wrapper;
  },

  // actions 故意置空：按钮已在 buildTopView 中自行绘制（并排布局）
  actions: [],

  onLoad: logic.onLoad,

  onUnload(_app: any) {
    // 停止星空动画
    if (_removeDelta) { _removeDelta(); _removeDelta = null; }
    logic.onUnload();
  },
};
