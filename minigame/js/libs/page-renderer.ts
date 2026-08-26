/**
 * 普通页面渲染器
 *
 * 业务模块约定：每个 export function 自动渲染成一个绿色按钮，
 * 按钮点击时直接调用对应函数（不传 ctx）。
 *
 * 业务函数如果需要把数据展示到页面上，请使用 rich-config + display 工厂模式
 * （参见 libs/rich-configs/display.ts），不要把展示逻辑塞进 page-renderer。
 */
const { p_button, p_text } = require('./component/index');
const fixedTemplate = require('./template/fixed');
const Scroller = require('./Scroller/index');
import type { PageConfig } from './demo-types';

/**
 * 信息展示区配置（与 rich-renderer 的 infoArea 字段一致）。
 * page-renderer 会从业务模块上读取 mod.infoArea / mod.onInfoTextReady，
 * 存在时在按钮列表上方渲染一个带边框的常驻文本区。
 */
interface InfoAreaField {
  initialText?: string;
  backgroundColor?: number;
  borderColor?: number;
  textColor?: number;
  fontSize?: number;
  lineHeight?: number;
  paddingX?: number;
  paddingY?: number;
  borderRadius?: number;
}

/**
 * 从纯函数模块构建 PageConfig
 * 模块中每个 export 的 function 会变成一个按钮
 */
function buildConfigFromModule(mod: any, pageLabel?: string): PageConfig {
  const actions: { label: string; handler: () => void }[] = [];
  const skipKeys = ['__esModule', 'default', 'title', 'apiName', 'onLoad', 'onUnload', 'setDisplay', 'infoArea', 'onInfoTextReady'];

  for (const key of Object.keys(mod)) {
    if (skipKeys.includes(key)) continue;
    if (typeof mod[key] === 'function') {
      actions.push({
        label: key,
        handler: () => mod[key](),
      });
    }
  }

  const config: PageConfig & {
    infoArea?: InfoAreaField;
    onInfoTextReady?: (setText: (text: string) => void) => void;
  } = {
    title: mod.title || pageLabel || '',
    apiName: mod.apiName || '',
    actions,
    onLoad: typeof mod.onLoad === 'function' ? () => mod.onLoad() : undefined,
    onUnload: typeof mod.onUnload === 'function' ? () => mod.onUnload() : undefined,
  };
  // 透传信息展示区配置（由 createInfoArea 生成）
  if (mod.infoArea) config.infoArea = mod.infoArea;
  if (typeof mod.onInfoTextReady === 'function') config.onInfoTextReady = mod.onInfoTextReady;
  return config;
}

module.exports = function renderPage(PIXI: any, app: any, obj: any, configOrMod: any, pageLabel?: string) {
  // 判断是 PageConfig 还是纯函数模块
  let config: PageConfig;
  if (configOrMod.actions && Array.isArray(configOrMod.actions)) {
    config = configOrMod;
  } else {
    config = buildConfigFromModule(configOrMod, pageLabel);
  }

  const container = new PIXI.Container();

  // 页面灰色背景（--wx-bg-0 = #EDEDED）
  const pageBg = new PIXI.Graphics();
  pageBg.beginFill(0xEDEDED).drawRect(0, 0, obj.width, obj.height).endFill();
  container.addChild(pageBg);

  // 1. 固定模板（标题、返回按钮、API名、分割线、logo）
  const { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
    obj,
    title: config.title,
    api_name: config.apiName || config.title,
  });

  // 统一灰色底贯穿全屏（包括导航栏）

  // 2. 计算内容区基线
  const baseY = underline
    ? (underline.height || 0) + (underline.y || 0) + 80 * PIXI.ratio
    : (api_name.height || 0) + (api_name.y || 0) + 80 * PIXI.ratio;

  const btnW = 580 * PIXI.ratio;
  const btnH = 88 * PIXI.ratio;
  const btnGap = 24 * PIXI.ratio;

  // logo 高度（用于计算底部留白）
  const bottomPadding = 110 * PIXI.ratio;
  const logoH = logo ? (logo.height || 0) + bottomPadding : 140 * PIXI.ratio;

  const cfgAny = config as any;
  const infoAreaConfig: InfoAreaField | undefined = cfgAny.infoArea;
  const onInfoTextReady: ((fn: (text: string) => void) => void) | undefined = cfgAny.onInfoTextReady;
  const hasInfo = !!infoAreaConfig;

  // ============== 统一滚动区（info 区 + 按钮，一起滚动） ==============
  // 与 rich-renderer 一致：有 infoArea 或有按钮时创建滚动容器
  const hasScrollableContent = hasInfo || (config.actions && config.actions.length > 0);
  const scrollH = obj.height - baseY - logoH;
  const infoBtnGap = 30 * PIXI.ratio;

  let scrollWrapper: any = null;
  let scrollInner: any = null;
  let scroller: any = null;

  if (hasScrollableContent) {
    scrollWrapper = new PIXI.Container();
    scrollWrapper.x = 0;
    scrollWrapper.y = baseY;
    scrollWrapper.interactive = true;

    scrollInner = new PIXI.Container();

    const scrollMask = new PIXI.Graphics();
    scrollMask.beginFill(0xffffff).drawRect(0, 0, obj.width, scrollH).endFill();
    scrollInner.mask = scrollMask;

    const scrollHitArea = new PIXI.Graphics();
    scrollHitArea.beginFill(0xffffff, 0).drawRect(0, 0, obj.width, scrollH).endFill();
    scrollHitArea.interactive = true;

    scrollWrapper.addChild(scrollHitArea, scrollInner, scrollMask);
    container.addChild(scrollWrapper);
  }

  // ---- info 区（如果配置了）----
  let infoAreaContainer: any = null;
  let infoAreaHeight = 0;
  let infoAreaLayout: (() => void) | null = null;
  const iaMaxH = Math.min(scrollH * 0.45, 480 * PIXI.ratio);
  let iaInnerScroller: any = null;

  if (infoAreaConfig) {
    const ia = infoAreaConfig;
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

    infoAreaContainer = new PIXI.Container();
    infoAreaContainer.x = iaX;
    infoAreaContainer.y = 0;

    const iaBg = new PIXI.Graphics();
    const iaBorder = new PIXI.Graphics();

    const iaScrollWrapper = new PIXI.Container();
    iaScrollWrapper.x = 0;
    iaScrollWrapper.y = 0;
    iaScrollWrapper.interactive = true;

    const iaScrollInner = new PIXI.Container();
    const iaScrollMask = new PIXI.Graphics();

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

    iaScrollInner.addChild(iaText);
    iaScrollInner.mask = iaScrollMask;

    const iaHitArea = new PIXI.Graphics();
    iaHitArea.interactive = true;

    iaScrollWrapper.addChild(iaHitArea, iaScrollInner, iaScrollMask);
    infoAreaContainer.addChild(iaBg, iaBorder, iaScrollWrapper);
    scrollInner.addChild(infoAreaContainer);

    iaInnerScroller = new Scroller((_l: number, t: number) => {
      iaScrollInner.y = -t;
    });
    iaScrollWrapper.interactive = false;

    infoAreaLayout = () => {
      const hasText = !!(iaText.text && iaText.text.trim());
      if (!hasText) {
        infoAreaContainer.visible = false;
        infoAreaHeight = 0;
        return;
      }
      infoAreaContainer.visible = true;
      const rawContentH = iaText.height + iaPadY * 2;
      const needScroll = rawContentH > iaMaxH;
      const displayH = needScroll ? iaMaxH : rawContentH;
      infoAreaHeight = displayH;

      iaBg.clear().beginFill(iaBgColor).drawRoundedRect(0, 0, iaW, displayH, iaBorderRadius).endFill();
      if (iaBgColor !== 0xFFFFFF) {
        iaBorder.clear().lineStyle(1 * PIXI.ratio, iaBorderColor, 0.4).drawRoundedRect(0, 0, iaW, displayH, iaBorderRadius);
      } else {
        iaBorder.clear();
      }

      iaScrollMask.clear().beginFill(0xffffff).drawRoundedRect(0, 0, iaW, displayH, iaBorderRadius).endFill();
      iaHitArea.clear().beginFill(0xffffff, 0).drawRect(0, 0, iaW, displayH).endFill();

      if (needScroll) {
        iaInnerScroller.contentSize(iaW, displayH, iaW, rawContentH);
      } else {
        iaInnerScroller.contentSize(iaW, displayH, iaW, displayH);
        iaScrollInner.y = 0;
      }
    };
  }

  // ---- 按钮 ----
  const btnX = (obj.width - btnW) / 2;
  const btnElements: any[] = [];

  if (config.actions && config.actions.length > 0) {
    config.actions.forEach((action) => {
      const btn = p_button(PIXI, {
        width: btnW,
        height: btnH,
        color: 0x07C160,
        y: 0,
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

      btn.onClickFn(() => {
        try {
          const result = action.handler();
          if (result && typeof (result as any).catch === 'function') {
            (result as any).catch((err: any) => {
              wx.showModal({ title: '错误', content: err.errMsg || String(err), showCancel: false });
            });
          }
        } catch (err: any) {
          console.error('[renderPage] handler error:', err);
          wx.showModal({ title: '错误', content: err.errMsg || String(err), showCancel: false });
        }
      });
      scrollInner.addChild(btn);
      btnElements.push(btn);
    });
  }

  // ---- 统一 scroller ----
  const totalBtnH = (config.actions ? config.actions.length : 0) * (btnH + btnGap) - btnGap;
  const layoutAll = () => {
    if (!scroller) return;
    let totalH = 0;
    if (infoAreaLayout) {
      infoAreaLayout();
      totalH += infoAreaHeight;
      if (infoAreaHeight > 0) totalH += infoBtnGap;
    }
    btnElements.forEach((btn, i) => {
      btn.y = totalH + i * (btnH + btnGap);
    });
    totalH += totalBtnH;
    scroller.contentSize(obj.width, scrollH, obj.width, totalH);
  };

  if (hasScrollableContent) {
    scroller = new Scroller((_l: number, t: number) => {
      scrollInner.y = -t;
    });

    // 嵌套滚动状态
    let touchInInfo = false;
    let innerConsuming = false;
    let lastTouchY = 0;

    const isPointInInfoArea = (globalY: number): boolean => {
      if (!infoAreaContainer || !infoAreaContainer.visible) return false;
      if (!iaInnerScroller || iaInnerScroller.rangeMovement.bottom <= 0) return false;
      const iaScreenY = baseY + scrollInner.y + infoAreaContainer.y;
      return globalY >= iaScreenY && globalY <= iaScreenY + infoAreaHeight;
    };

    (scrollWrapper as any).touchstart = (e: any) => {
      e.stopPropagation();
      const y = e.data.global.y;
      lastTouchY = y;
      touchInInfo = isPointInInfoArea(y);
      if (touchInInfo) {
        innerConsuming = true;
        iaInnerScroller.doTouchStart(e.data.global.x, y);
      } else {
        innerConsuming = false;
        scroller.doTouchStart(e.data.global.x, y);
      }
    };
    (scrollWrapper as any).touchmove = (e: any) => {
      e.stopPropagation();
      const y = e.data.global.y;
      const ts = e.data.originalEvent.timeStamp;
      if (!touchInInfo) {
        scroller.doTouchMove(e.data.global.x, y, ts);
      } else if (innerConsuming) {
        const deltaY = lastTouchY - y;
        const { top, bottom } = iaInnerScroller.rangeMovement;
        const atTop = top <= 0 && deltaY < 0;
        const atBottom = top >= bottom && deltaY > 0;
        if (atTop || atBottom) {
          innerConsuming = false;
          iaInnerScroller.doTouchEnd(ts);
          scroller.doTouchStart(e.data.global.x, y);
        } else {
          iaInnerScroller.doTouchMove(e.data.global.x, y, ts);
        }
      } else {
        scroller.doTouchMove(e.data.global.x, y, ts);
      }
      lastTouchY = y;
    };
    (scrollWrapper as any).touchend = (e: any) => {
      e.stopPropagation();
      const ts = e.data.originalEvent.timeStamp;
      if (touchInInfo && innerConsuming) {
        iaInnerScroller.doTouchEnd(ts);
      } else {
        scroller.doTouchEnd(ts);
      }
      touchInInfo = false;
      innerConsuming = false;
    };

    // setText 回调
    if (onInfoTextReady && infoAreaContainer) {
      try {
        onInfoTextReady((text: string) => {
          const iaScrollWrapper = infoAreaContainer.children[2];
          const iaScrollInnerRef = iaScrollWrapper?.children?.[1];
          const iaTextRef = iaScrollInnerRef?.children?.[0];
          if (!iaTextRef) return;
          iaTextRef.text = text || '';
          if (iaScrollInnerRef) iaScrollInnerRef.y = 0;
          layoutAll();
        });
      } catch (e) { /* ignore */ }
    }

    layoutAll();
  }

  // 3. 返回按钮回调
  goBack.callBack = () => {
    // no-op: onUnload 由 router.delPage 里的 _onUnload 触发
  };

  // 4. 组装
  container.addChild(goBack, title, api_name);
  if (underline) container.addChild(underline);
  container.addChild(logo, logoName);

  app.stage.addChild(container);

  // 5. 触发 onLoad
  if (config.onLoad) {
    try { config.onLoad(); } catch (err) { console.error('onLoad error:', err); }
  }

  return container;
};
