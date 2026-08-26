/**
 * loadFont rich-config
 * 对齐 demo2：显示 "Hello WeChat" 文字 + 加载按钮，加载后文字应用自定义字体
 */

import * as logic from '../../api/render/loadFont/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '加载自定义字体文件',
  apiName: 'loadFont',

  buildTopView(PIXI: any, _app: any, _obj: any, underline: any) {
    const { p_text, p_box, p_button } = require('../component/index');
    const underlineBottom = underline ? underline.y + underline.height : 0;
    const container = new PIXI.Container();

    const box = p_box(PIXI, {
      height: 372 * PIXI.ratio,
      y: underlineBottom + 23 * PIXI.ratio,
    });

    const text = p_text(PIXI, {
      content: 'Hello WeChat',
      fontSize: 60 * PIXI.ratio,
      fill: 0x353535,
      relative_middle: {
        containerWidth: box.width,
        containerHeight: box.height,
      },
    });

    const button = p_button(PIXI, {
      width: 580 * PIXI.ratio,
      y: box.height + box.y + 80 * PIXI.ratio,
    });
    button.myAddChildFn(
      p_text(PIXI, {
        content: '加载自定义字体文件',
        fontSize: 36 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: button.width,
          containerHeight: button.height,
        },
      }),
    );
    button.onClickFn(() => {
      logic.loadFont();
    });

    logic.setOnLoad((font: string) => {
      (text as any).turnText('', { fontFamily: font || '' });
    });

    box.addChild(text);
    container.addChild(box, button);
    return container;
  },

  actions: [],

  onUnload: () => logic.onUnload(),
};
