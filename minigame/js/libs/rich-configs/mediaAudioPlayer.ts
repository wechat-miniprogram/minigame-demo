/**
 * mediaAudioPlayer rich-config
 *
 * 页面布局：scroll 从 underline 下方开始
 * - 上方：功能按钮（start / stopAll / destroyAll）
 * - 下方：帧数据展示区（灰色背景卡片，内含 canvas 纹理 + 帧信息文本）
 *
 * image() 支持两种参数：
 *   - string: 图片路径 → PIXI.Texture.fromImage
 *   - canvas 对象: → PIXI.Texture.fromCanvas，后续仅 update 纹理
 * data() 仅在内容变化时重建文本
 */

import * as logic from '../../api/media/mediaAudioPlayer/index';
import type { RichConfig } from '../rich-renderer';
import type { DisplayApi } from './display';

export const config: RichConfig = {
  title: '媒体音频播放器',
  apiName: 'mediaAudioPlayer',

  // 透传信息展示区
  infoArea: logic.infoArea,
  onInfoTextReady: logic.onInfoTextReady,

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_button, p_scroll } = require('../component/index');

    const underlineBottom = underline ? underline.y + underline.height : 0;
    const ratio = PIXI.ratio;
    const btnW = 580 * ratio;
    const btnH = 80 * ratio;
    const btnGap = 20 * ratio;

    // ====== 滚动容器 ======
    const scrollH = obj.height - underlineBottom;
    const scroll = p_scroll(PIXI, { height: scrollH });
    scroll.position.y = underlineBottom;

    // ====== 按钮 ======
    const actions = [
      { label: 'start', handler: () => logic.start() },
      { label: 'stop', handler: () => logic.stopAll() },
      { label: 'destroyAll', handler: () => logic.destroyAll() },
    ];

    const btnX = (scroll.width - btnW) / 2;
    let lastBtnBottom = 0;

    actions.forEach((action, i) => {
      const btn = p_button(PIXI, {
        width: btnW,
        height: btnH,
        y: i * (btnH + btnGap),
      });
      btn.x = btnX;
      btn.myAddChildFn(
        p_text(PIXI, {
          content: action.label,
          fontSize: 30 * ratio,
          fill: 0xffffff,
          fontWeight: 'normal',
          relative_middle: { containerWidth: btn.width, containerHeight: btn.height },
        })
      );
      btn.onClickFn(() => {
        try { action.handler(); } catch (e: any) {
          wx.showToast({ title: e.errMsg || String(e), icon: 'none' });
        }
      });
      scroll.myAddChildFn(btn);
      lastBtnBottom = btn.y + btnH;
    });

    // ====== 帧数据展示区 ======
    const frameAreaY = lastBtnBottom + 30 * ratio;
    const frameAreaPad = 20 * ratio;
    const frameAreaW = scroll.width - frameAreaPad * 2;
    const frameAreaInitialH = 400 * ratio;

    const frameContainer = new PIXI.Container();
    frameContainer.x = frameAreaPad;
    frameContainer.y = frameAreaY;

    let frameAreaH = frameAreaInitialH;
    const frameBg = new PIXI.Graphics();
    function drawFrameBg(h: number) {
      frameBg.clear();
      frameBg.beginFill(0xf5f5f5, 1).drawRoundedRect(0, 0, frameAreaW, h, 16 * ratio).endFill();
    }
    drawFrameBg(frameAreaH);
    frameContainer.addChild(frameBg);

    const placeholder = new PIXI.Text('点击 start 开始播放', {
      fontSize: `${28 * ratio}px`,
      fill: 0x999999,
    });
    placeholder.x = (frameAreaW - placeholder.width) / 2;
    placeholder.y = (frameAreaH - placeholder.height) / 2;
    frameContainer.addChild(placeholder);

    scroll.myAddChildFn(frameContainer);

    // ====== 帧展示相关 ======
    let frameSprite: any = null;
    let frameTexture: any = null;
    let infoText: any = null;
    let lastDataStr = '';

    function changeScrollHeight() {
      const totalHeight = frameAreaY + frameAreaH + 60 * ratio;
      scroll.scroller.contentSize(scroll.width, scroll.height, scroll.width, totalHeight);
    }

    function redrawFrameArea() {
      drawFrameBg(frameAreaH);
      if (placeholder.visible) {
        placeholder.x = (frameAreaW - placeholder.width) / 2;
        placeholder.y = (frameAreaH - placeholder.height) / 2;
      }
      changeScrollHeight();
    }

    /** 计算帧图片在展示区内的尺寸和位置 */
    function layoutFrameSprite(srcW: number, srcH: number) {
      const padX = 20 * ratio;
      const maxImgW = frameAreaW - padX * 2;
      const maxImgH = 320 * ratio;
      const scale = Math.min(maxImgW / srcW, maxImgH / srcH, 1);
      const imgW = srcW * scale;
      const imgH = srcH * scale;
      return { imgW, imgH, imgX: (frameAreaW - imgW) / 2, imgY: 20 * ratio };
    }

    // ====== 提供自定义 DisplayApi ======
    const api: DisplayApi = {
      text(content: string) {
        wx.showToast({ title: content, icon: 'none' });
      },
      data(kv: Record<string, any>) {
        const newStr = JSON.stringify(kv);
        if (newStr === lastDataStr) return;
        lastDataStr = newStr;

        placeholder.visible = false;

        if (infoText) {
          frameContainer.removeChild(infoText);
          infoText.destroy?.();
          infoText = null;
        }

        const padX = 20 * ratio;
        const padY = 16 * ratio;
        const innerW = frameAreaW - padX * 2;

        const lines: string[] = [];
        for (const [key, val] of Object.entries(kv)) {
          lines.push(`${key}: ${val}`);
        }

        infoText = new PIXI.Text(lines.join('\n'), {
          fontSize: `${24 * ratio}px`,
          fill: 0x555555,
          lineHeight: 36 * ratio,
          wordWrap: true,
          wordWrapWidth: innerW,
          breakWords: true,
        });
        infoText.x = padX;
        infoText.y = frameSprite
          ? frameSprite.y + frameSprite.height + 10 * ratio
          : padY;
        frameContainer.addChild(infoText);

        const contentBottom = infoText.y + infoText.height + padY;
        if (contentBottom > frameAreaH) {
          frameAreaH = contentBottom;
          redrawFrameArea();
        }
      },
      image(src: any) {
        placeholder.visible = false;

        // canvas 对象 → 高效更新纹理
        if (src && typeof src !== 'string' && src.getContext) {
          if (!frameSprite || !frameTexture) {
            frameTexture = PIXI.Texture.fromCanvas(src);
            const { imgW, imgH, imgX, imgY } = layoutFrameSprite(src.width, src.height);
            frameSprite = new PIXI.Sprite(frameTexture);
            frameSprite.width = imgW;
            frameSprite.height = imgH;
            frameSprite.x = imgX;
            frameSprite.y = imgY;
            frameContainer.addChild(frameSprite);

            const imgBottom = imgY + imgH + 20 * ratio;
            if (imgBottom > frameAreaH) {
              frameAreaH = imgBottom;
              redrawFrameArea();
            }
          } else {
            frameTexture.update();
          }
          return;
        }

        // 字符串路径 → 创建图片 sprite
        if (frameSprite) {
          frameContainer.removeChild(frameSprite);
          frameSprite.destroy?.();
          frameSprite = null;
          frameTexture = null;
        }

        const padX = 20 * ratio;
        const maxImgW = frameAreaW - padX * 2;
        const imgSize = Math.min(maxImgW, 320 * ratio);

        frameSprite = new PIXI.Sprite(PIXI.Texture.fromImage(src));
        frameSprite.width = imgSize;
        frameSprite.height = imgSize;
        frameSprite.x = (frameAreaW - imgSize) / 2;
        frameSprite.y = 20 * ratio;
        frameContainer.addChild(frameSprite);

        if (infoText) {
          infoText.y = frameSprite.y + frameSprite.height + 10 * ratio;
          const contentBottom = infoText.y + infoText.height + 16 * ratio;
          if (contentBottom > frameAreaH) {
            frameAreaH = contentBottom;
            redrawFrameArea();
          }
        } else {
          const imgBottom = frameSprite.y + imgSize + 20 * ratio;
          if (imgBottom > frameAreaH) {
            frameAreaH = imgBottom;
            redrawFrameArea();
          }
        }
      },
      clear() {
        if (frameSprite) {
          frameContainer.removeChild(frameSprite);
          frameSprite.destroy?.();
          frameSprite = null;
          frameTexture = null;
        }
        if (infoText) {
          frameContainer.removeChild(infoText);
          infoText.destroy?.();
          infoText = null;
        }
        lastDataStr = '';
        placeholder.visible = true;
        frameAreaH = frameAreaInitialH;
        redrawFrameArea();
      },
    };

    logic.setDisplay(api);

    return scroll;
  },

  actions: [],

  onUnload() {
    logic.onUnload();
  },
};
