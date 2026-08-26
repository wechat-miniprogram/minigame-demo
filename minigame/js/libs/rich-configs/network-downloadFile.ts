/**
 * downloadFile rich-config
 * 对齐 demo2：说明文字 + 下载按钮，下载完成后展示图片
 */

import * as logic from '../../api/network/downloadFile/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '下载文件',
  apiName: 'downloadFile',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_button, p_text, p_img } = require('../component/index');
    const baseY = underline ? underline.y + underline.height : 0;

    const container = new PIXI.Container();

    const explain = p_text(PIXI, {
      content: '点击按钮下载服务端实例图片',
      fontSize: 30 * PIXI.ratio,
      fill: 0x999999,
      y: baseY + 300 * PIXI.ratio,
      relative_middle: { containerWidth: obj.width },
    });

    const button = p_button(PIXI, {
      y: explain.y + explain.height + 300 * PIXI.ratio,
    });
    button.myAddChildFn(
      p_text(PIXI, {
        content: '下载',
        fontSize: 30 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: button.width,
          containerHeight: button.height,
        },
      })
    );

    button.onClickFn(() => {
      logic.downloadFile();
    });

    logic.setOnImage((tempFilePath: string) => {
      PIXI.loader.add(tempFilePath).load(() => {
        const sprite = p_img(PIXI, {
          src: tempFilePath,
          is_PIXI_loader: true,
          x: 30 * PIXI.ratio,
          y: baseY + 200 * PIXI.ratio,
        });
        sprite.height =
          ((obj.width - 60 * PIXI.ratio) * sprite.height) / sprite.width;
        sprite.width = obj.width - 60 * PIXI.ratio;
        explain.hideFn();
        button.hideFn();
        container.addChild(sprite);
      });
    });

    container.addChild(explain, button);
    return container;
  },

  actions: [],
};
