import type { RichConfig } from '../rich-renderer';
import { ARRenderer, ARMode, ARConfig } from '../ar/arRenderer';

export interface ARModuleConfig {
  title: string;
  /** 英文 API 名称，作为页面副标题 */
  apiName?: string;
  tip: string;
  buttonName: string | null;
  mode: ARMode;
  vkConfig: ARConfig;
}

export function createArConfig(mod: any, pageLabel?: string): RichConfig {
  const { p_text, p_button } = require('../component/index');
  const cfg: ARModuleConfig = mod.arConfig || mod.default;

  let rootRef: any = null;
  let renderer: ARRenderer | null = null;
  let arTexture: any = null;
  let arSprite: any = null;
  let tickerFn: ((dt: number) => void) | null = null;
  let switchBtn: any = null;
  let switchBtnText: any = null;
  let screenBg: any = null;
  let initTipText: any = null;

  let transfer2dCanvas: any = null;
  let transfer2dCtx: any = null;

  return {
    title: cfg.title || pageLabel || '',
    apiName: cfg.apiName || '',
    actions: [],

    buildTopView(PIXI: any, app: any, obj: any, underline: any) {
      const root = new PIXI.Container();
      rootRef = root;

      // 计算 AR 画面区域的尺寸和位置（对齐旧版 view.js）
      // 旧版 view.js: screen.y = title.height + title.y + 78 * PIXI.ratio（紧贴 api_name 下方）
      // fixedTemplate 布局关系：
      //   api_name.y = title.h + title.y + 78
      //   underline.y = api_name.y + api_name.h + 23
      // 所以: screenTop = underline.y - api_name.h - 23 ≈ underline.y - 67 * ratio
      const API_NAME_H = 44 * PIXI.ratio; // fontSize=32 的文字高度约 44
      const screenTop = underline
        ? underline.y - API_NAME_H - 23 * PIXI.ratio - (underline.height || 0)
        : 120 * PIXI.ratio;

      // AR 画面高度：对齐旧版 behavior.js 的 canvas.height * 0.7
      // 同时确保不超过屏幕底部 logo 区域
      const logoH = 100 * PIXI.ratio;
      const maxScreenH = obj.height - screenTop - logoH;
      const screenH = Math.min(obj.height * 0.7, maxScreenH);

      // AR 画面区域（PIXI Graphics 背景 + Canvas Texture 叠加）
      screenBg = new PIXI.Graphics();
      screenBg
        .beginFill(0x000000)
        .drawRect(0, screenTop, obj.width, screenH)
        .endFill();
      screenBg.interactive = true;
      root.addChild(screenBg);

      // 提示文字
      const tipText = p_text(PIXI, {
        content: cfg.tip,
        fontSize: 26 * PIXI.ratio,
        fill: 0x576b95,
        y: screenTop + screenH + 10 * PIXI.ratio,
        relative_middle: {
          containerWidth: obj.width,
        },
      });
      root.addChild(tipText);

      // 可选：摄像头切换按钮
      if (cfg.buttonName) {
        switchBtn = p_button(PIXI, {
          width: 370 * PIXI.ratio,
          height: 80 * PIXI.ratio,
          fill: 0x07c160,
          x: (obj.width - 370 * PIXI.ratio) / 2,
          y: screenTop + 20 * PIXI.ratio,
        });
        switchBtnText = p_text(PIXI, {
          content: cfg.buttonName,
          fontSize: 32 * PIXI.ratio,
          fill: 0x000000,
          relative_middle: {
            containerWidth: switchBtn.width,
            containerHeight: switchBtn.height,
          },
        });
        switchBtn.myAddChildFn(switchBtnText);
        switchBtn.interactive = true;
        switchBtn.onClickFn(() => {
          if (renderer) {
            // 先读取当前 cameraPosition 确定切换后的按钮文字（cfg 是静态配置，switchCamera 不会修改它）
            const current = cfg.vkConfig.cameraPosition || 0;
            renderer.switchCamera();
            if (switchBtnText && switchBtnText.turnText) {
              switchBtnText.turnText(
                current === 0 ? '切换为后置摄像头' : '切换为前置摄像头'
              );
            }
          }
        });
        root.addChild(switchBtn);
      }

      // 初始化 ARRenderer
      const arCanvasWidth = obj.width;
      const arCanvasHeight = screenH;

      // v2 模式初始化提示文字（frame=null 期间显示）
      const isV2 = cfg.vkConfig.version === 'v2';
      if (isV2) {
        initTipText = p_text(PIXI, {
          content: '请左右移动手机进行初始化',
          fontSize: 28 * PIXI.ratio,
          fill: 0xffffff,
          x: obj.width / 2,
          y: screenTop + screenH / 2,
        });
        initTipText.anchor.set(0.5, 0.5);
        initTipText.visible = false; // 默认隐藏，等 onInitStatusChange 触发
        root.addChild(initTipText);
      }

      // 对齐旧版 behavior.js：YUV 渲染整个离屏 canvas，不做裁剪
      // 旧版的 YUV shader 没有 screenTop/screenBottom 参数，全屏渲染后通过 drawImage 定位
      renderer = new ARRenderer({
        mode: cfg.mode,
        config: { ...cfg.vkConfig },
        width: arCanvasWidth,
        height: arCanvasHeight,
        onTouchEnd: (x: number, y: number) => {
          const arX = x;
          const arY = y - screenTop;
          if (renderer) {
            renderer.onTouchEnd(arX, arY);
          }
        },
        onError: (err: string) => {
          console.error('[aiAr] 异步错误:', err);
          wx.showToast({ title: '当前设备不支持', icon: 'none', duration: 3000 });
          if (arSprite) arSprite.visible = false;
          if (screenBg) screenBg.visible = false;
        },
        onInitStatusChange: (ready: boolean) => {
          if (ready) {
            // 初始化完成 → 隐藏提示
            if (initTipText) {
              initTipText.visible = false;
            }
          } else {
            // 等待初始化 → 显示提示
            if (initTipText) {
              initTipText.visible = true;
            } else {
              wx.showToast({ title: '请左右移动手机进行初始化', icon: 'none', duration: 3000 });
            }
          }
        },
      });

      // 初始化 ARRenderer（用 try-catch 防止环境不支持时崩溃）
      let initError: string | null = null;
      try {
        renderer.init();
      } catch (e: any) {
        initError = e?.errMsg || e?.message || String(e);
        console.error('[aiAr] AR 初始化失败:', initError);
      }

      const vkError = renderer?.vkError;
      const hasSyncError = initError || vkError;

      // 获取 WebGL 离屏 canvas
      const webglCanvas = renderer?.getCanvas();

      // 即使没有同步错误也创建相机画面（异步错误通过 onError 回调隐藏）
      if (webglCanvas && !hasSyncError) {
        // ========== 对齐旧版 behavior.js 的 drawImage 方案 ==========
        // 创建 2D 中转 canvas，用于每帧将 WebGL 内容绘制过来
        transfer2dCanvas = (wx as any).createCanvas();
        transfer2dCanvas.width = arCanvasWidth;
        transfer2dCanvas.height = arCanvasHeight;
        transfer2dCtx = transfer2dCanvas.getContext('2d');

        // 用 2D 中转 canvas 创建 PIXI Texture
        arTexture = PIXI.Texture.fromCanvas(transfer2dCanvas);
        arSprite = new PIXI.Sprite(arTexture);
        arSprite.x = 0;
        arSprite.y = screenTop;
        arSprite.width = obj.width;
        arSprite.height = screenH;
        root.addChild(arSprite);

        // 将摄像头切换按钮提升到 AR 画面上方（防止被 arSprite 遮挡）
        if (switchBtn) {
          root.setChildIndex(switchBtn, root.children.length - 1);
        }

        // drawImage 从 WebGL 离屏 canvas 拷贝到 2D 中转 canvas，再更新 PIXI 纹理
        // iOS：在 VKSession RAF 内同步执行（WebGL 渲染后缓冲区会很快失效，需立即拷贝）
        // Android：在 PIXI ticker 中执行（Android WebGL 缓冲区不会主动清除）
        const drawFn = () => {
          if (!transfer2dCtx || !webglCanvas) return;
          try {
            transfer2dCtx.drawImage(
              webglCanvas,
              0, 0, arCanvasWidth, arCanvasHeight,
              0, 0, arCanvasWidth, arCanvasHeight
            );
            if (arTexture) {
              arTexture.update();
            }
          } catch (_e) {
            /* noop */
          }
        };

        const isIOS = (wx as any).getSystemInfoSync().platform === 'ios';
        if (isIOS) {
          renderer.onRenderCallback = drawFn;
        } else {
          tickerFn = drawFn;
          app.ticker.add(tickerFn);
        }
      } else {
        console.error('[aiAr] AR 初始化失败:', initError || vkError);
        wx.showToast({ title: '当前设备不支持', icon: 'none', duration: 3000 });
      }

      // 触摸事件转发到 ARRenderer
      const handleTouchEnd = (e: any) => {
        if (!renderer) return;
        const touch = e.data.global;
        renderer.onTouchEnd(touch.x, touch.y - screenTop);
      };
      (screenBg as any).touchend = handleTouchEnd;
      if (arSprite) {
        (arSprite as any).touchend = handleTouchEnd;
        arSprite.interactive = true;
      }

      return root;
    },

    onLoad() {
      // root 已加入 page container，提升到最上层确保 AR 画面不被按钮遮挡
      try {
        const parent = rootRef && rootRef.parent;
        if (parent) {
          parent.setChildIndex(rootRef, parent.children.length - 1);
        }
      } catch (_e) {
        /* noop */
      }
    },

    onUnload(app: any) {
      // Android：移除 PIXI ticker
      if (tickerFn && app) {
        app.ticker.remove(tickerFn);
        tickerFn = null;
      }

      // 销毁 AR 渲染器（onRenderCallback 随 renderer 一起释放）
      if (renderer) {
        renderer.dispose();
        renderer = null;
      }

      // 清理 PIXI 资源
      if (arTexture) {
        try {
          arTexture.destroy(true);
        } catch (_e) {
          /* noop */
        }
        arTexture = null;
      }
      arSprite = null;
      switchBtn = null;
      switchBtnText = null;
      transfer2dCanvas = null;
      transfer2dCtx = null;
      screenBg = null;
      initTipText = null;
      rootRef = null;
    },
  };
}
