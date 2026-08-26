/**
 * 开放数据域专用 rich-config
 *
 * 对齐原版 minigame-demo/ShareCanvas.js 的渲染方式：
 *   - sprite 直接 addChild 到 app.stage（和原版一样）
 *   - 使用 PIXI.ticker.shared（和原版一样）
 *   - 每帧先 removeChild 旧 sprite 再 addChild 新的
 *   - fromCanvas 延迟到首次 renderFriendRank 时调用
 *   - ticker 按需 add/remove
 *   - 遮罩和关闭按钮也加到 app.stage（确保在 sprite 之上）
 */

import type { RichConfig } from '../rich-renderer';
import type { DisplayApi, DisplayModule } from './display';

export function createOpenDataContextConfig(
  mod: DisplayModule,
  pageLabel?: string,
): RichConfig {
  const { p_text } = require('../component/index');

  const skipKeys = [
    '__esModule',
    'default',
    'title',
    'apiName',
    'onLoad',
    'onUnload',
    'setDisplay',
    'infoArea',
    'onInfoTextReady',
  ];
  const actions: { label: string; handler: () => void }[] = [];
  for (const key of Object.keys(mod)) {
    if (skipKeys.includes(key)) continue;
    if (typeof mod[key] === 'function') {
      actions.push({
        label: key,
        handler: () => mod[key](),
      });
    }
  }

  let rootRef: any = null;
  let sharedCanvasShowed = false;
  let tickerAdded = false;
  let tickFn: (() => void) | null = null;
  let appRef: any = null;
  let pixiRef: any = null;

  // sharedCanvas 相关
  let openDataContext: any = null;
  let sharedCanvas: any = null;
  let texture: any = null;
  let GAME_WIDTH = 0;
  let GAME_HEIGHT = 0;
  let sharedWidth = 0;
  let sharedHeight = 0;

  const INIT_WIDTH = 960;
  const INIT_HEIGHT = 1410;

  // 遮罩/关闭按钮（加在 app.stage 上，而非 root container）
  let canvasOverlay: any = null;
  let canvasCloseBtn: any = null;

  function initSharedCanvas() {
    openDataContext = wx.getOpenDataContext();
    sharedCanvas = openDataContext.canvas;
    const info = wx.getSystemInfoSync();
    GAME_WIDTH = info.windowWidth * info.pixelRatio;
    GAME_HEIGHT = info.windowHeight * info.pixelRatio;

    sharedCanvas.width = INIT_WIDTH;
    sharedCanvas.height = INIT_HEIGHT;

    const temp = INIT_HEIGHT / INIT_WIDTH;
    const times = 0.85;
    sharedWidth = GAME_WIDTH * times;
    sharedHeight = temp * sharedWidth;

    // updateSubViewPort（对齐原版）
    const realWidth = sharedWidth / GAME_WIDTH * info.windowWidth;
    const realHeight = sharedHeight / GAME_HEIGHT * info.windowHeight;
    openDataContext.postMessage({
      event: 'updateViewPort',
      box: {
        width: realWidth,
        height: realHeight,
        x: (info.windowWidth - realWidth) / 2,
        y: (info.windowHeight - realHeight) / 2,
      },
    });
  }

  /** 对齐原版 renderFriendRank：延迟 fromCanvas + 每帧新建 sprite */
  function renderFriendRank() {
    if (!pixiRef || !appRef || !sharedCanvas) return;
    if (!texture) {
      texture = pixiRef.Texture.fromCanvas(sharedCanvas);
    }
    texture.update();

    const shared = new pixiRef.Sprite(texture);
    shared.name = 'shared';
    shared.width = sharedWidth;
    shared.height = sharedHeight;
    shared.x = GAME_WIDTH / 2 - shared.width / 2;
    shared.y = GAME_HEIGHT / 2 - shared.height / 2;

    appRef.stage.addChild(shared);

    // 确保遮罩在 sprite 下面，关闭按钮在 sprite 上面
    try {
      if (canvasOverlay && canvasOverlay.parent === appRef.stage) {
        // 顺序：overlay → shared → closeBtn
        appRef.stage.setChildIndex(canvasOverlay, appRef.stage.children.length - 3);
        appRef.stage.setChildIndex(shared, appRef.stage.children.length - 2);
        appRef.stage.setChildIndex(canvasCloseBtn, appRef.stage.children.length - 1);
      }
    } catch (_e) {
      /* noop */
    }
  }

  /** 对齐原版 rankTiker：每帧先清除再绘制 */
  function rankTicker() {
    if (!appRef) return;
    const sub = appRef.stage.getChildByName('shared');
    if (sub) appRef.stage.removeChild(sub);

    if (sharedCanvasShowed) {
      renderFriendRank();
    }
  }

  function hideSharedCanvasView() {
    sharedCanvasShowed = false;

    // 停止 ticker
    if (tickFn && tickerAdded && pixiRef) {
      pixiRef.ticker.shared.remove(tickFn);
      tickerAdded = false;
    }
    // 清除残留 sprite
    if (appRef) {
      const sub = appRef.stage.getChildByName('shared');
      if (sub) appRef.stage.removeChild(sub);
    }

    // 隐藏并移除遮罩和关闭按钮
    if (canvasOverlay) {
      canvasOverlay.visible = false;
      if (canvasOverlay.parent) canvasOverlay.parent.removeChild(canvasOverlay);
    }
    if (canvasCloseBtn) {
      canvasCloseBtn.visible = false;
      if (canvasCloseBtn.parent) canvasCloseBtn.parent.removeChild(canvasCloseBtn);
    }

    // 通知子域关闭
    try {
      openDataContext?.postMessage({ event: 'close' });
    } catch (_e) {
      /* noop */
    }

    wx.triggerGC();
  }

  return {
    title: mod.title || pageLabel || '开放数据域',
    apiName: mod.apiName || 'openDataContext',
    actions,

    // 透传信息展示区配置
    infoArea: mod.infoArea,
    onInfoTextReady: mod.onInfoTextReady,

    buildTopView(PIXI: any, app: any, obj: any, _underline: any) {
      const root = new PIXI.Container();
      rootRef = root;
      appRef = app;
      pixiRef = PIXI;

      // 初始化 sharedCanvas（不调用 fromCanvas！）
      try {
        initSharedCanvas();
      } catch (_e) {
        /* 开发工具可能不支持 */
      }

      tickFn = rankTicker;

      // 创建全屏遮罩（加到 app.stage，确保盖住所有按钮）
      canvasOverlay = new PIXI.Graphics();
      canvasOverlay
        .beginFill(0xf6f6f6)
        .drawRect(0, 0, obj.width, obj.height)
        .endFill();
      canvasOverlay.name = 'canvasOverlay';
      canvasOverlay.visible = false;
      // 不在这里 addChild，showCanvas 时再加

      // 创建关闭按钮（也加到 app.stage，确保在 sprite 之上）
      const floatCloseSize = 72 * PIXI.ratio;
      const spriteX = GAME_WIDTH / 2 - sharedWidth / 2;
      const spriteY = GAME_HEIGHT / 2 - sharedHeight / 2;
      canvasCloseBtn = new PIXI.Container();
      canvasCloseBtn.x = spriteX + sharedWidth - floatCloseSize * 0.3;
      canvasCloseBtn.y = spriteY - floatCloseSize * 0.3;
      const fcbBg = new PIXI.Graphics();
      fcbBg
        .beginFill(0x000000, 0.5)
        .drawCircle(floatCloseSize / 2, floatCloseSize / 2, floatCloseSize / 2)
        .endFill();
      const fcbIcon = p_text(PIXI, {
        content: '✕',
        fontSize: 34 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: floatCloseSize,
          containerHeight: floatCloseSize,
        },
      });
      canvasCloseBtn.addChild(fcbBg, fcbIcon);
      canvasCloseBtn.name = 'canvasCloseBtn';
      canvasCloseBtn.visible = false;
      canvasCloseBtn.interactive = true;
      (canvasCloseBtn as any).touchend = (e: any) => {
        e.stopPropagation();
        hideSharedCanvasView();
        try {
          mod.closeCanvas();
        } catch (_e) {
          /* noop */
        }
      };
      // 不在这里 addChild，showCanvas 时再加

      // ============== DisplayApi ==============
      const api: DisplayApi = {
        text(_content: string) {
          /* 已改用 toast */
        },
        data(_kv: Record<string, any>) {
          /* 已改用 toast */
        },
        image(_src: string) {
          /* noop */
        },
        clear() {
          /* noop */
        },
        showCanvas() {
          if (sharedCanvasShowed) return;
          sharedCanvasShowed = true;

          // 将遮罩和关闭按钮加到 app.stage 最顶层
          if (canvasOverlay) {
            canvasOverlay.visible = true;
            app.stage.addChild(canvasOverlay);
          }
          if (canvasCloseBtn) {
            canvasCloseBtn.visible = true;
            app.stage.addChild(canvasCloseBtn);
          }

          // 启动 ticker
          if (tickFn && !tickerAdded) {
            PIXI.ticker.shared.add(tickFn);
            tickerAdded = true;
          }
        },
      };

      mod.setDisplay(api);

      return root;
    },

    onLoad() {
      try {
        const parent = rootRef && rootRef.parent;
        if (parent) {
          parent.setChildIndex(rootRef, parent.children.length - 1);
        }
      } catch (_e) {
        /* noop */
      }

      if (mod.onLoad) {
        try {
          mod.onLoad();
        } catch (e) {
          console.error('onLoad error:', e);
        }
      }
    },

    onUnload(_app: any) {
      hideSharedCanvasView();
      texture = null;

      if (mod.onUnload) {
        try {
          mod.onUnload();
        } catch (_e) {
          /* noop */
        }
      }
    },
  };
}
