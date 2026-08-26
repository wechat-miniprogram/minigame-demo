/**
 * 通用结果展示 rich-config 工厂
 *
 * 适用场景：业务层只需要把 API 返回值展示到页面上（文本 / 键值对 / 图片），
 * 不需要自定义 UI 的 API。用这个工厂可以避免为每个 API 单独写一份 rich-config。
 *
 * 展示形式：弹窗（Modal）。点击按钮 → API 执行 → display.* 触发，
 *   弹出居中卡片显示结果，避免按钮和数据相互遮挡。
 *
 * 业务层用法（示例见 api/device/getBatteryInfo/index.ts）：
 *   import { createDisplay } from '../../../libs/display-slot';
 *   const display = createDisplay();
 *   export const setDisplay = display.setter;   // 给 rich-config 用
 *
 *   export function getBatteryInfo() {
 *     wx.getBatteryInfo({
 *       success: (res) => display.data({ '电量': res.level + '%' }),
 *     });
 *   }
 */

import type { RichConfig } from '../rich-renderer';

const Scroller = require('../Scroller/index');

/**
 * 业务层暴露给 rich-config 的接口约定。
 * 业务层必须 export `setDisplay`，用来把展示区 api 回调给自己使用。
 */
export interface DisplayApi {
  /** 展示纯文本（一行） */
  text(content: string): void;
  /** 展示键值对列表 */
  data(kv: Record<string, any>): void;
  /** 展示图片（远程 url 或本地 path） */
  image(src: string): void;
  /** 清空展示区 */
  clear(): void;
  /** 显示 sharedCanvas（开放数据域专用，其他页面空实现） */
  showCanvas?(): void;
  /** 注册弹窗关闭回调（如恢复被遮挡的原生按钮） */
  onClose?(cb: () => void): void;
}

export interface DisplayModule {
  title?: string;
  apiName?: string;
  /** 业务层必须 export 一个同名函数，rich-config 调用它来把 DisplayApi 交给业务层 */
  setDisplay: (api: DisplayApi) => void;
  /** 业务层可选的 onLoad */
  onLoad?: () => void;
  /** 业务层可选的 onUnload */
  onUnload?: () => void;

  // ============== 信息展示区（按钮上方常驻文本区） ==============

  /**
   * 信息展示区配置。存在时会在按钮列表上方渲染一个带边框的文本容器。
   * 业务层通过 onInfoTextReady 获取 setText 回调动态更新内容。
   */
  infoArea?: {
    initialText?: string;
    backgroundColor?: number;
    borderColor?: number;
    textColor?: number;
    fontSize?: number;
    lineHeight?: number;
    paddingX?: number;
    paddingY?: number;
    borderRadius?: number;
  };
  /**
   * infoArea 渲染完成后回调。
   * 参数 setText 可用于动态更新信息区的文本内容。
   */
  onInfoTextReady?: (setText: (text: string) => void) => void;

  /** 其他的任意 export function 都会被当作按钮 */
  [key: string]: any;
}

/**
 * 从业务模块构建 RichConfig。
 *
 * @param mod           业务模块（require 进来的 index）
 * @param pageLabel     路由里的 label（作为标题兜底）
 */
export function createDisplayConfig(mod: DisplayModule, pageLabel?: string): RichConfig {
  const { p_text, p_box } = require('../component/index');

  // 收集 export 的业务函数作为按钮（跳过约定字段）
  const skipKeys = ['__esModule', 'default', 'title', 'apiName', 'onLoad', 'onUnload', 'setDisplay', 'infoArea', 'onInfoTextReady'];
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

  // root 引用，给 onLoad 阶段提到最上层用
  let rootRef: any = null;

  return {
    title: mod.title || pageLabel || '',
    apiName: mod.apiName || '',
    actions,

    // 透传信息展示区配置
    infoArea: mod.infoArea,
    onInfoTextReady: mod.onInfoTextReady,

    buildTopView(PIXI: any, _app: any, obj: any, _underline: any) {
      // 本容器同时承载：
      //  - 一个零尺寸占位（不渲染任何东西，让 rich-renderer 计算按钮基线时不引入额外偏移）
      //  - 一个默认隐藏的全屏 modal，触发 display.* 时显示
      const root = new PIXI.Container();
      rootRef = root;

      // ============== 弹窗结构 ==============
      const modal = new PIXI.Container();
      modal.visible = false;

      // 全屏遮罩（对齐 --wx-overlay-50）
      const overlay = new PIXI.Graphics();
      overlay.beginFill(0x000000, 0.5).drawRect(0, 0, obj.width, obj.height).endFill();
      overlay.interactive = true;
      modal.addChild(overlay);

      // 卡片尺寸（居中，宽度约束参考 --wx 大屏 600pt 主体区）
      const cardW = Math.min(obj.width - 80 * PIXI.ratio, 620 * PIXI.ratio);
      const cardH = Math.min(obj.height - 280 * PIXI.ratio, 880 * PIXI.ratio);
      const cardX = (obj.width - cardW) / 2;
      const cardY = (obj.height - cardH) / 2;

      const card = new PIXI.Container();
      card.x = cardX;
      card.y = cardY;
      card.interactive = true;
      // 阻止点卡片穿透到 overlay 关闭弹窗
      (card as any).touchstart = (e: any) => e.stopPropagation();
      (card as any).touchend = (e: any) => e.stopPropagation();

      // 卡片底（--wx-radius-xl = 16px 圆角）
      const cardBg = new PIXI.Graphics();
      cardBg.beginFill(0xffffff).drawRoundedRect(0, 0, cardW, cardH, 16 * PIXI.ratio).endFill();
      card.addChild(cardBg);

      // 标题（--wx-size-title-1 = 17px → 34 设计稿，Medium 字重）
      const headerH = 96 * PIXI.ratio;
      const titleText = p_text(PIXI, {
        content: '调用结果',
        fontSize: 34 * PIXI.ratio,
        fill: 0x000000,
        fontWeight: 'normal',
        x: 32 * PIXI.ratio,
        y: 30 * PIXI.ratio,
      });
      card.addChild(titleText);

      // 关闭按钮（右上角圆形 ✕）
      const closeSize = 52 * PIXI.ratio;
      const closeBtn = new PIXI.Container();
      closeBtn.x = cardW - closeSize - 24 * PIXI.ratio;
      closeBtn.y = 22 * PIXI.ratio;
      const closeBg = new PIXI.Graphics();
      closeBg.beginFill(0xF2F2F2).drawCircle(closeSize / 2, closeSize / 2, closeSize / 2).endFill();
      const closeIcon = p_text(PIXI, {
        content: '✕',
        fontSize: 24 * PIXI.ratio,
        fill: 0x999999,
        relative_middle: { containerWidth: closeSize, containerHeight: closeSize },
      });
      closeBtn.addChild(closeBg, closeIcon);
      closeBtn.interactive = true;
      card.addChild(closeBtn);

      // 标题下分割线（更轻量的灰色线，等同 --wx-bg-0 / separator）
      const headerLine = new PIXI.Graphics();
      headerLine
        .beginFill(0xEDEDED)
        .drawRect(0, headerH, cardW, PIXI.ratio | 0)
        .endFill();
      card.addChild(headerLine);

      // 内容区（mask + 可滚动）
      const contentTop = headerH + 8 * PIXI.ratio;
      const contentBottom = cardH - 24 * PIXI.ratio;
      const contentH = contentBottom - contentTop;
      const contentW = cardW;

      const contentWrapper = new PIXI.Container();
      contentWrapper.x = 0;
      contentWrapper.y = contentTop;
      contentWrapper.interactive = true;

      const contentInner = new PIXI.Container();
      contentInner.x = 0;
      contentInner.y = 0;

      const contentMask = new PIXI.Graphics();
      contentMask.beginFill(0xffffff).drawRect(0, 0, contentW, contentH).endFill();
      contentInner.mask = contentMask;

      // 透明命中区（保证空白也可拖动滚动）
      const hit = new PIXI.Graphics();
      hit.beginFill(0xffffff, 0).drawRect(0, 0, contentW, contentH).endFill();
      hit.interactive = true;

      contentWrapper.addChild(hit, contentInner, contentMask);
      card.addChild(contentWrapper);

      modal.addChild(card);
      // modal 加到 root（root 是 buildTopView 返回值，会被 rich-renderer 加进 page container；
      // 我们在 onLoad 里再把 root 提到 page container 的最后位置，确保盖住按钮和 logo）
      root.addChild(modal);

      // ============== 滚动 ==============
      const scroller = new Scroller((_l: number, t: number) => {
        contentInner.y = -t;
      });
      let scrollRegistered = false;
      const layoutScroll = () => {
        const total = contentInner.height || 0;
        scroller.contentSize(contentW, contentH, contentW, total);
        scrollRegistered = true;
      };

      (contentWrapper as any).touchstart = (e: any) => {
        e.stopPropagation();
        if (!scrollRegistered) return;
        scroller.doTouchStart(e.data.global.x, e.data.global.y);
      };
      (contentWrapper as any).touchmove = (e: any) => {
        e.stopPropagation();
        if (!scrollRegistered) return;
        scroller.doTouchMove(e.data.global.x, e.data.global.y, e.data.originalEvent.timeStamp);
      };
      (contentWrapper as any).touchend = (e: any) => {
        e.stopPropagation();
        if (!scrollRegistered) return;
        scroller.doTouchEnd(e.data.originalEvent.timeStamp);
      };

      // ============== 弹窗显示 / 关闭 ==============
      let closeCallback: (() => void) | null = null;
      const showModal = () => {
        modal.visible = true;
        // 重置滚动位置
        contentInner.y = 0;
      };
      const hideModal = () => {
        modal.visible = false;
        // 触发关闭回调（如恢复被遮挡的原生按钮）
        if (closeCallback) {
          try { closeCallback(); } catch (e) { /* ignore */ }
        }
      };
      (overlay as any).touchstart = (e: any) => {
        e.stopPropagation();
        // 记录触摸起点，用于判断是点击还是滑动
        overlay._touchStartY = e.data.global.y;
        overlay._touchStartTime = e.data.originalEvent.timeStamp;
      };
      (overlay as any).touchend = (e: any) => {
        e.stopPropagation();
        // 只有短按且位移很小时才视为"点击关闭"
        const dy = Math.abs(e.data.global.y - (overlay._touchStartY ?? 0));
        const dt = e.data.originalEvent.timeStamp - (overlay._touchStartTime ?? 0);
        if (dy < 10 && dt < 300) {
          hideModal();
        }
      };
      (closeBtn as any).touchend = (e: any) => {
        e.stopPropagation();
        hideModal();
      };

      // ============== 内容渲染 ==============
      const padX = 24 * PIXI.ratio;
      const padY = 16 * PIXI.ratio;
      const innerW = contentW - padX * 2;

      // 使用原生 PIXI.Text 以启用 wordWrap（p_text 不透传换行参数）
      const textView: any = new PIXI.Text('', {
        fontSize: `${26 * PIXI.ratio}px`,
        fill: 0x353535,
        lineHeight: 38 * PIXI.ratio,
        wordWrap: true,
        wordWrapWidth: innerW,
        breakWords: true,
      });
      textView.x = padX;
      textView.y = padY;
      textView.visible = false;

      const dataView = new PIXI.Container();
      dataView.visible = false;
      dataView.x = padX;
      dataView.y = padY;

      let imageView: any = null;

      contentInner.addChild(textView, dataView);

      const clearAll = () => {
        textView.visible = false;
        dataView.visible = false;
        if (imageView) imageView.visible = false;
      };

      const setTitle = (s: string) => {
        if ((titleText as any).turnText) (titleText as any).turnText(s);
      };

      const api: DisplayApi = {
        text(content: string) {
          clearAll();
          textView.visible = true;
          textView.text = content;
          setTitle('调用结果');
          showModal();
          layoutScroll();
        },
        data(kv: Record<string, any>) {
          clearAll();
          dataView.visible = true;
          // 清空旧行
          while (dataView.children.length > 0) {
            dataView.removeChildAt(0);
          }

          const keyFontSize = 24 * PIXI.ratio;
          const valFontSize = 24 * PIXI.ratio;
          const lineHeight = 34 * PIXI.ratio;
          const rowMinH = 72 * PIXI.ratio;
          const rowPadX = 20 * PIXI.ratio;
          const rowPadY = 20 * PIXI.ratio;
          const colGap = 16 * PIXI.ratio;
          // value 列起点的硬上限（避免极端长 key 把 value 挤没）
          const keyColMax = Math.floor(innerW * 0.5);

          // ---- 第一遍：先创建所有 keyT，找到所需的最大 key 宽度 ----
          const rows: { key: string; value: any; keyT: any }[] = [];
          let maxKeyWidth = 0;
          for (const [key, value] of Object.entries(kv)) {
            const keyT = new PIXI.Text(String(key), {
              fontSize: `${keyFontSize}px`,
              fill: 0x808080,
              lineHeight,
              wordWrap: true,
              wordWrapWidth: keyColMax,
              breakWords: true,
            });
            if (keyT.width > maxKeyWidth) maxKeyWidth = keyT.width;
            rows.push({ key, value, keyT });
          }

          // value 列起点 x：基于实际最大 key 宽度 + 间距，但不超过 keyColMax
          const valX = rowPadX + Math.min(maxKeyWidth, keyColMax) + colGap;
          const valMaxW = innerW - valX - rowPadX;

          // ---- 第二遍：按统一的 valX 渲染每一行 ----
          let yOffset = 0;
          for (const { value, keyT } of rows) {
            const valWrapWidth = Math.max(valMaxW, innerW * 0.45);
          const valT = new PIXI.Text(String(value), {
              fontSize: `${valFontSize}px`,
              fill: 0x353535,
              lineHeight,
              wordWrap: true,
              wordWrapWidth: valWrapWidth,
              breakWords: true,
            });
            valT.x = valX;
            valT.y = rowPadY;

            keyT.x = rowPadX;
            keyT.y = rowPadY;

            // 行高按 key/value 实际高度的较大者撑开
            const contentH = Math.max(keyT.height, valT.height);
            const rowH = Math.max(rowMinH, contentH + rowPadY * 2);

            const row = p_box(PIXI, {
              width: innerW,
              height: rowH,
              y: yOffset,
              background: { color: 0xF7F7F7, alpha: 1 },
              radius: 8 * PIXI.ratio,
            });
            row.addChild(keyT, valT);
            dataView.addChild(row);
            yOffset += rowH + 8 * PIXI.ratio;
          }
          setTitle('调用结果');
          showModal();
          layoutScroll();
        },
        image(src: string) {
          clearAll();
          if (imageView) {
            contentInner.removeChild(imageView);
            imageView.destroy(true);
            imageView = null;
          }
          const img = new PIXI.Sprite(PIXI.Texture.fromImage(src));
          const maxImgW = innerW;
          const maxImgH = contentH - padY * 2;
          const size = Math.min(maxImgW, maxImgH, 480 * PIXI.ratio);
          img.width = size;
          img.height = size;
          img.x = (contentW - size) / 2;
          img.y = padY;
          contentInner.addChild(img);
          imageView = img;
          setTitle('调用结果');
          showModal();
          layoutScroll();
        },
        clear() {
          clearAll();
          hideModal();
        },
        onClose(cb: () => void) {
          closeCallback = cb;
        },
      };

      mod.setDisplay(api);

      return root;
    },

    onLoad() {
      // 此时 root 已加入 page container，page container 已加入 stage。
      // rich-renderer 的渲染顺序里 topView 是最早加入的，会被按钮和 logo 盖住。
      // 我们把 root 提到 page container 的最后位置，让 modal 拥有最高 z-order。
      try {
        const parent = rootRef && rootRef.parent;
        if (parent) {
          parent.setChildIndex(rootRef, parent.children.length - 1);
        }
      } catch (e) { /* noop */ }

      if (mod.onLoad) {
        try { mod.onLoad(); } catch (e) { console.error('onLoad error:', e); }
      }
    },

    onUnload: () => { if (mod.onUnload) mod.onUnload(); },
  };
}
