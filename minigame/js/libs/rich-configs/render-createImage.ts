/**
 * createImage rich-config
 * 对齐 demo2：创建按钮 → 确认弹窗 → 加载图片 → 显示图片和尺寸
 */

import * as logic from '../../api/render/createImage/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '创建一个图片对象',
  apiName: 'createImage',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_img, p_button } = require('../component/index');
    const underlineBottom = underline ? underline.y + underline.height : 0;
    const container = new PIXI.Container();

    const button = p_button(PIXI, {
      width: 580 * PIXI.ratio,
      y: underlineBottom + 123 * PIXI.ratio,
    });
    button.myAddChildFn(
      p_text(PIXI, {
        content: '创建',
        fontSize: 36 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: button.width,
          containerHeight: button.height,
        },
      }),
    );
    button.onClickFn(() => {
      logic.createImage();
    });

    logic.setOnCreate((img: any) => {
      button.hideFn();
      const imageEl = p_img(PIXI, {
        width: 620 * PIXI.ratio,
        height: 224 * PIXI.ratio,
        src: img.src,
        y: underlineBottom + 67.5 * PIXI.ratio,
        relative_middle: { containerWidth: obj.width },
      });
      container.addChild(
        imageEl,
        p_text(PIXI, {
          content: `width:${img.width}px   height:${img.height}px`,
          fontSize: 30 * PIXI.ratio,
          fill: 0x353535,
          y: imageEl.height + imageEl.y + 30 * PIXI.ratio,
          relative_middle: { containerWidth: obj.width },
        }),
      );
    });

    container.addChild(button);
    return container;
  },

  actions: [],

  onUnload: () => logic.onUnload(),
};
