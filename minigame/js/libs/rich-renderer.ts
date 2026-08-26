/**
 * 富模板渲染器
 *
 * 用于需要自定义 UI 的复杂 API 示例页面（星空动画、旋转三角形、传感器可视化等）。
 * index.ts 只写纯逻辑，rich-configs/ 里的配置描述 UI 结构，
 * rich-renderer 负责根据配置渲染出完整 PIXI 页面。
 */

const fixedTemplate = require('./template/fixed');
const { p_button, p_text } = require('./component/index');
const Scroller = require('./Scroller/index');
import { renderHighlightedJSON, isJSONString } from './json-highlighter';

export interface RichConfig {
  /** 页面标题 */
  title: string;
  /** API 名称 */
  apiName?: string;
  /** 页面背景色，默认白色 */
  background?: number;
  /**
   * 渲染自定义顶部视图，返回 PIXI 容器。
   * underline 是 fixedTemplate 生成的分割线，可用于计算内容起始 y 坐标。
   * app 用于操作 ticker（添加/移除动画帧）。
   */
  buildTopView: (PIXI: any, app: any, obj: any, underline: any) => any;
  /** 按钮配置 */
  actions: { label: string; handler: () => void }[];
  /** 页面打开时执行 */
  onLoad?: () => void;
  /**
   * 页面关闭时执行，传入 app 方便移除 ticker。
   */
  onUnload?: (app: any) => void;

  // ============== 信息展示区（按钮上方常驻文本区） ==============

  /**
   * 信息展示区配置。
   * 存在时会在按钮列表上方渲染一个带边框的文本容器，
   * 业务层通过 onInfoTextReady 获取 setText 回调动态更新内容。
   */
  infoArea?: {
    /** 初始显示的文本 */
    initialText?: string;
    /** 背景色，默认 0xf5f0dc（浅黄） */
    backgroundColor?: number;
    /** 边框色，默认 0x333333 */
    borderColor?: number;
    /** 文字颜色，默认 0x333333 */
    textColor?: number;
    /** 字号，默认 28px（乘以 ratio） */
    fontSize?: number;
    /** 行高倍数，默认 1.4 */
    lineHeight?: number;
    /** 容器内水平内边距，默认 24px（乘以 ratio） */
    paddingX?: number;
    /** 容器内垂直内边距，默认 20px（乘以 ratio） */
    paddingY?: number;
    /** 圆角半径，默认 8px（乘以 ratio） */
    borderRadius?: number;
  };
  /**
   * infoArea 渲染完成后回调。
   * 参数 setText 可用于动态更新信息区的文本内容。
   */
  onInfoTextReady?: (setText: (text: string) => void) => void;
}

module.exports = function richRenderer(PIXI: any, app: any, obj: any, config: RichConfig) {
  const container = new PIXI.Container();

  // 背景色（默认使用 --wx-bg-0 #EDEDED 灰色底，让白色卡片和按钮有层级感）
  const pageBg = new PIXI.Graphics();
  pageBg.beginFill(config.background ?? 0xEDEDED).drawRect(0, 0, obj.width, obj.height).endFill();
  container.addChild(pageBg);

  // 顶部固定模板（先生成，把 underline 传给 buildTopView）
  const { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
    obj,
    title: config.title,
    api_name: config.apiName || config.title,
  });

  // 统一灰色底贯穿全屏（包括导航栏），不做白色头部分区

  // 自定义顶部视图
  const topView = config.buildTopView(PIXI, app, obj, underline);
  if (topView) container.addChild(topView);

  // 按钮列表（在 topView 下方，支持滚动）
  // 注意：Container.height = localBounds.maxY - localBounds.minY，
  // 当子元素不从 y=0 开始时，topView.y + topView.height 不等于实际底部，
  // 需要用 getBounds() 获取全局边界来正确计算
  const topViewBounds = topView ? topView.getBounds() : null;
  const topViewBottom = topViewBounds ? topViewBounds.y + topViewBounds.height : 0;
  const baseY = Math.max(
    topViewBottom + 40 * PIXI.ratio,
    underline ? (underline.y || 0) + (underline.height || 0) + 80 * PIXI.ratio : 0
  );

  // ============== 两区独立布局：info 区（上）+ 按钮区（下），各自固定高度独立滚动 ==============
  const bottomPadding = 110 * PIXI.ratio;
  const logoH = logo ? (logo.height || 0) + bottomPadding : 140 * PIXI.ratio;
  const btnW = 580 * PIXI.ratio;
  const btnH = 88 * PIXI.ratio;
  const btnGap = 24 * PIXI.ratio;
  const totalAvailableH = obj.height - baseY - logoH; // 可用总高度
  const regionGap = 20 * PIXI.ratio; // info 区与按钮区之间间距

  const hasInfoArea = !!config.infoArea;
  const hasButtons = !!config.actions && config.actions.length > 0;

  // 分配高度：有 info 区时上 27.5% 下 72.5%，无 info 区时按钮占满
  let infoRegionH = 0;
  let btnRegionH = 0;
  if (hasInfoArea && hasButtons) {
    infoRegionH = Math.floor((totalAvailableH - regionGap) * 0.275);
    btnRegionH = totalAvailableH - regionGap - infoRegionH;
  } else if (hasInfoArea) {
    infoRegionH = totalAvailableH;
  } else if (hasButtons) {
    btnRegionH = totalAvailableH;
  }

  const infoRegionY = baseY;
  const btnRegionY = hasInfoArea ? baseY + infoRegionH + regionGap : baseY;

  // JSON 高亮模式状态
  let isHighlightMode = false;
  let highlightContentH = 0;
  let iaHighlightContainer: any = null;
  let iaHighlightBg: any = null;
  let iaTextRef: any = null;
  let iaRef: any = null;
  let iaInnerWRef = 0;

  // ============== info 区（独立滚动） ==============
  let iaInnerScroller: any = null;
  let infoWrapperRef: any = null; // 引用 info 容器，按钮区之后再 addChild

  if (hasInfoArea) {
    const ia = config.infoArea!;
    const iaBgColor = ia.backgroundColor ?? 0xFFFFFF;
    const iaBorderColor = ia.borderColor ?? 0xE5E5E5;
    const iaTextColor = ia.textColor ?? 0x353535;
    const iaFontSize = (ia.fontSize || 26) * PIXI.ratio;
    const iaLineH = iaFontSize * (ia.lineHeight || 1.5);
    const iaPadX = (ia.paddingX || 28) * PIXI.ratio;
    const iaPadY = (ia.paddingY || 28) * PIXI.ratio;
    const iaBorderRadius = (ia.borderRadius || 12) * PIXI.ratio;

    const iaW = btnW;
    const iaInnerW = iaW - iaPadX * 2;
    const iaX = (obj.width - iaW) / 2;

    // info 区外壳容器（固定位置）——延迟添加到 container（在按钮区之后），确保 z-order 更高
    const infoWrapper = new PIXI.Container();
    infoWrapper.x = iaX;
    infoWrapper.y = infoRegionY;

    // 背景和边框
    const iaBg = new PIXI.Graphics();
    iaBg.beginFill(iaBgColor).drawRoundedRect(0, 0, iaW, infoRegionH, iaBorderRadius).endFill();
    const iaBorder = new PIXI.Graphics();
    if (iaBgColor !== 0xFFFFFF) {
      iaBorder.lineStyle(1 * PIXI.ratio, iaBorderColor, 0.4).drawRoundedRect(0, 0, iaW, infoRegionH, iaBorderRadius);
    }

    // 滚动内容
    const iaScrollInner = new PIXI.Container();
    const iaScrollMask = new PIXI.Graphics();
    iaScrollMask.beginFill(0xffffff).drawRoundedRect(0, 0, iaW, infoRegionH, iaBorderRadius).endFill();
    iaScrollInner.mask = iaScrollMask;

    // 透明命中区（不再使用 PIXI 事件，改用 canvas 原生事件统一处理）
    const iaHitArea = new PIXI.Graphics();
    iaHitArea.beginFill(0xffffff, 0.001).drawRect(0, 0, iaW, infoRegionH).endFill();

    // 文本
    const iaText = new PIXI.Text(ia.initialText || '', {
      fontSize: `${iaFontSize}px`,
      fill: iaTextColor,
      lineHeight: iaLineH,
      wordWrap: true,
      wordWrapWidth: iaInnerW,
      breakWords: true,
    });
    iaText.x = iaPadX;
    iaText.y = iaPadY;

    // JSON 高亮容器
    iaHighlightContainer = new PIXI.Container();
    iaHighlightContainer.x = iaPadX;
    iaHighlightContainer.y = iaPadY;
    iaHighlightContainer.visible = false;

    iaHighlightBg = new PIXI.Graphics();
    iaHighlightBg.visible = false;

    // 赋值外部引用
    iaTextRef = iaText;
    iaRef = ia;
    iaInnerWRef = iaInnerW;

    iaScrollInner.addChild(iaHighlightBg, iaText, iaHighlightContainer);

    // 注意添加顺序：iaHitArea 在最上层（最后添加），确保能拦截触摸
    infoWrapper.addChild(iaBg, iaBorder, iaScrollInner, iaScrollMask, iaHitArea);
    // 保存引用，按钮区之后再 addChild 到 container（确保 z-order 最高）
    infoWrapperRef = infoWrapper;

    // info 区滚动器
    iaInnerScroller = new Scroller((_l: number, t: number) => {
      if (!iaScrollInner.transform) return;
      iaScrollInner.y = -t;
    });

    // info 区触摸事件改为 canvas 原生事件（在按钮区代码之后统一绑定）

    // 布局函数：更新滚动器内容尺寸
    const updateInfoScroller = () => {
      let rawContentH: number;
      if (isHighlightMode) {
        rawContentH = highlightContentH + iaPadY * 2;
        iaHighlightBg.visible = false;
        iaText.visible = false;
        iaHighlightContainer.visible = true;
      } else {
        rawContentH = iaText.height + iaPadY * 2;
        iaHighlightBg.visible = false;
        iaText.visible = true;
        iaHighlightContainer.visible = false;
      }
      iaInnerScroller.contentSize(iaW, infoRegionH, iaW, Math.max(rawContentH, infoRegionH));
    };

    // setText 回调（支持 JSON 语法高亮）
    if (config.onInfoTextReady) {
      try {
        config.onInfoTextReady((text: string) => {
          if (!iaTextRef || !iaHighlightContainer) return;
          if (!text) {
            isHighlightMode = false;
            iaTextRef.text = '';
            while (iaHighlightContainer.children.length > 0) {
              iaHighlightContainer.removeChildAt(0);
            }
          } else if (isJSONString(text)) {
            isHighlightMode = true;
            iaTextRef.text = '';
            const hlResult = renderHighlightedJSON(PIXI, iaHighlightContainer, text, {
              fontSize: iaRef?.fontSize || 26,
              lineHeight: iaRef?.lineHeight || 1.5,
              maxWidth: iaInnerWRef,
              maxLines: 0,
              theme: 'light',
            });
            highlightContentH = hlResult.contentHeight;
          } else {
            isHighlightMode = false;
            iaTextRef.text = text;
            while (iaHighlightContainer.children.length > 0) {
              iaHighlightContainer.removeChildAt(0);
            }
          }
          iaScrollInner.y = 0;
          updateInfoScroller();
        });
      } catch (e) { /* ignore */ }
    }

    // 初始布局
    updateInfoScroller();
  }

  // ============== 按钮区（独立滚动） ==============
  const btnX = (obj.width - btnW) / 2;

  if (hasButtons) {
    const btnWrapper = new PIXI.Container();
    btnWrapper.x = 0;
    btnWrapper.y = btnRegionY;

    const btnScrollInner = new PIXI.Container();
    const btnScrollMask = new PIXI.Graphics();
    btnScrollMask.beginFill(0xffffff).drawRect(0, 0, obj.width, btnRegionH).endFill();
    btnScrollInner.mask = btnScrollMask;

    // 创建按钮
    // 注意：不调用 btn.onClickFn()，避免按钮设置 interactive=true 后抢夺 btnHitArea 的触摸事件，
    // 导致按钮区无法滚动。点击逻辑统一由 btnHitArea 的 touchend 手动命中测试实现。
    const totalBtnH = config.actions!.length * (btnH + btnGap) - btnGap;
    config.actions!.forEach((action, i) => {
      const btn = p_button(PIXI, {
        width: btnW,
        height: btnH,
        color: 0x07C160,
        y: i * (btnH + btnGap),
        radius: 8 * PIXI.ratio,
      });
      btn.x = btnX;
      btn.myAddChildFn(
        p_text(PIXI, {
          content: action.label,
          fontSize: 30 * PIXI.ratio,
          fill: 0xffffff,
          fontWeight: 'normal',
          relative_middle: { containerWidth: btn.width, containerHeight: btn.height },
        })
      );
      // 不调用 btn.onClickFn()，保持按钮非 interactive 状态
      btnScrollInner.addChild(btn);
    });

    btnWrapper.addChild(btnScrollInner, btnScrollMask);
    container.addChild(btnWrapper);

    // 按钮区滚动器（回调中检查 transform 防止 destroy 后访问崩溃）
    const btnScroller = new Scroller((_l: number, t: number) => {
      if (!btnScrollInner.transform) return;
      btnScrollInner.y = -t;
    });
    btnScroller.contentSize(obj.width, btnRegionH, obj.width, Math.max(totalBtnH, btnRegionH));

    // 保存引用到 container，供统一原生事件处理函数使用
    (container as any).__btnScroller = btnScroller;
    (container as any).__btnScrollInner = btnScrollInner;
  }

  // info 区在按钮区之后添加，确保 z-order 最高
  if (infoWrapperRef) {
    container.addChild(infoWrapperRef);
  }

  // ============== 统一 canvas 原生触摸事件：info 区 + 按钮区互斥滚动 ==============
  // PIXI 4.8.8 Canvas 模式下 touchmove 不可靠，全部改用原生事件实现滚动。
  // 坐标关系：PIXI全局坐标 = clientY * pixelRatio（见 game.ts mapPositionToPoint）
  const { pixelRatio: _dpr } = wx.getSystemInfoSync();
  const dpr = _dpr || 2;

  // 屏幕坐标（clientY）范围
  const infoScreenTop = hasInfoArea ? infoRegionY / dpr : 0;
  const infoScreenBottom = hasInfoArea ? (infoRegionY + infoRegionH) / dpr : 0;
  const btnScreenTop = hasButtons ? btnRegionY / dpr : 0;
  const btnScreenBottom = hasButtons ? (btnRegionY + btnRegionH) / dpr : 0;

  // 当前触摸归属：'info' | 'btn' | null
  let activeRegion: 'info' | 'btn' | null = null;
  let touchMoved = false;
  let touchStartY = 0;
  let scrollDestroyed = false; // 页面销毁标记

  const onTouchStart = (e: any) => {
    if (scrollDestroyed) return;
    const touch = e.touches[0];
    if (!touch) return;
    const y = touch.clientY;
    touchMoved = false;
    touchStartY = y;

    if (hasInfoArea && iaInnerScroller && y >= infoScreenTop && y <= infoScreenBottom) {
      activeRegion = 'info';
      iaInnerScroller.doTouchStart(touch.clientX * dpr, y * dpr);
    } else if (hasButtons && y >= btnScreenTop && y <= btnScreenBottom) {
      activeRegion = 'btn';
      const btnScroller = (container as any).__btnScroller;
      if (btnScroller) btnScroller.doTouchStart(touch.clientX * dpr, y * dpr);
    } else {
      activeRegion = null;
    }
  };

  const MOVE_THRESHOLD = 5; // 移动超过 5px 屏幕像素才算滑动

  const onTouchMove = (e: any) => {
    if (scrollDestroyed || !activeRegion) return;
    const touch = e.touches[0];
    if (!touch) return;

    // 判断是否超过移动阈值
    if (!touchMoved && Math.abs(touch.clientY - touchStartY) > MOVE_THRESHOLD) {
      touchMoved = true;
    }

    if (activeRegion === 'info' && iaInnerScroller) {
      iaInnerScroller.doTouchMove(touch.clientX * dpr, touch.clientY * dpr, e.timeStamp);
    } else if (activeRegion === 'btn') {
      const btnScroller = (container as any).__btnScroller;
      if (btnScroller) btnScroller.doTouchMove(touch.clientX * dpr, touch.clientY * dpr, e.timeStamp);
    }
  };

  const onTouchEnd = (e: any) => {
    if (scrollDestroyed || !activeRegion) return;
    const region = activeRegion;
    activeRegion = null;

    if (region === 'info' && iaInnerScroller) {
      iaInnerScroller.doTouchEnd(e.timeStamp);
    } else if (region === 'btn') {
      const btnScroller = (container as any).__btnScroller;
      const btnScrollInner = (container as any).__btnScrollInner;
      if (btnScroller) btnScroller.doTouchEnd(e.timeStamp);
      console.log('[BTN-CLICK-DEBUG] touchEnd region=btn, touchMoved:', touchMoved, 'hasButtons:', hasButtons, 'btnScrollInner:', !!btnScrollInner);
      if (!touchMoved && hasButtons && btnScrollInner) {
        // 没有滑动 = 点击，找到对应按钮并触发
        const touchY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
        const globalY = touchY * dpr;
        const localY = globalY - btnRegionY + (-btnScrollInner.y);
        console.log('[BTN-CLICK-DEBUG] touchY:', touchY, 'globalY:', globalY, 'btnRegionY:', btnRegionY, 'scrollInner.y:', btnScrollInner.y, 'localY:', localY);
        console.log('[BTN-CLICK-DEBUG] btnH:', btnH, 'btnGap:', btnGap, '按钮数:', config.actions!.length);
        let hit = false;
        for (let i = 0; i < config.actions!.length; i++) {
          const btnTop = i * (btnH + btnGap);
          const btnBottom = btnTop + btnH;
          if (localY >= btnTop && localY <= btnBottom) {
            console.log('[BTN-CLICK-DEBUG] 命中按钮', i, config.actions![i].label, 'btnTop:', btnTop, 'btnBottom:', btnBottom);
            hit = true;
            try { config.actions![i].handler(); } catch (err: any) {
              wx.showModal({ title: '错误', content: err.errMsg || String(err), showCancel: false });
            }
            break;
          }
        }
        if (!hit) {
          console.log('[BTN-CLICK-DEBUG] 未命中任何按钮, localY:', localY, '第一个按钮范围: 0~' + btnH);
        }
      }
    }
  };

  // 绑定 canvas 原生触摸事件
  const gameCanvas = canvas || (typeof GameGlobal !== 'undefined' && (GameGlobal as any).canvas);
  if (gameCanvas) {
    gameCanvas.addEventListener('touchstart', onTouchStart);
    gameCanvas.addEventListener('touchmove', onTouchMove);
    gameCanvas.addEventListener('touchend', onTouchEnd);
    gameCanvas.addEventListener('touchcancel', onTouchEnd);
  }

  // 清理函数：标记销毁 + 停止惯性动画 + 移除事件监听器
  const cleanupScrollEvents = () => {
    scrollDestroyed = true;
    activeRegion = null;
    // 停止 Scroller 惯性动画
    if (iaInnerScroller) iaInnerScroller.tickerStop = true;
    const btnScroller = (container as any).__btnScroller;
    if (btnScroller) btnScroller.tickerStop = true;
    if (gameCanvas) {
      gameCanvas.removeEventListener('touchstart', onTouchStart);
      gameCanvas.removeEventListener('touchmove', onTouchMove);
      gameCanvas.removeEventListener('touchend', onTouchEnd);
      gameCanvas.removeEventListener('touchcancel', onTouchEnd);
    }
  };
  (container as any).__btnScrollCleanup = cleanupScrollEvents;

  // 返回按钮回调
  //   onUnload 的清理统一由 router.delPage 里的 _onUnload 负责调用（见 router.ts），
  //   这里不再直接调，避免 onUnload 被调用两次（第一次销毁异步资源可能与第二次冲突，
  //   导致返回卡住，如 mediaAudioPlayer 的 player.destroy 场景）。

  // 组装固定元素（覆盖在 topView 之上）
  container.addChild(goBack, title, api_name);
  if (underline) container.addChild(underline);
  container.addChild(logo, logoName);

  // 滑块触摸结束清理已移除：
  // 之前的递归 clearTouchmoveDeep 会把弹窗滚动器的 touchmove 也清掉，
  // 导致弹窗内容无法上下滑动。滑块拖不动的问题已通过 getBounds() 修复
  // topViewBottom 计算，scrollWrapper 的 hitArea 不再遮挡滑块。

  app.stage.addChild(container);

  if (config.onLoad) {
    try { config.onLoad(); } catch (e) { console.error('onLoad error:', e); }
  }

  // 增强 onUnload：在页面卸载时清理 canvas 原生事件监听器
  const originalOnUnload = config.onUnload;
  config.onUnload = (appRef: any) => {
    if ((container as any).__btnScrollCleanup) {
      (container as any).__btnScrollCleanup();
      (container as any).__btnScrollCleanup = null;
    }
    if (originalOnUnload) originalOnUnload(appRef);
  };

  return container;
};
