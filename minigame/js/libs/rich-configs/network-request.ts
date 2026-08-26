/**
 * request rich-config
 * 对齐 demo2：说明文字 + request 按钮，点击后展示数据包大小和耗时
 */

import * as logic from '../../api/network/request/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '发送请求',
  apiName: 'request',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_button, p_text } = require('../component/index');
    const baseY = underline ? underline.y + underline.height : 0;

    const container = new PIXI.Container();

    const explain = p_text(PIXI, {
      content: '点击向服务器发起请求',
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
        content: 'request',
        fontSize: 30 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: button.width,
          containerHeight: button.height,
        },
      })
    );

    button.onClickFn(() => {
      logic.sendRequest();
    });

    logic.setOnData((dataSize: number, elapsed: number) => {
      explain.turnText(
        `数据包大小(字符长度)：${dataSize}\n请求耗时：${elapsed}ms`
      );
    });

    container.addChild(explain, button);
    return container;
  },

  actions: [],
};
