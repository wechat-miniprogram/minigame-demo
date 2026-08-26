/**
 * webSocket rich-config
 * 完全照抄 demo2/miniprogram/js/api/network/webSocket/view.js
 */

import * as logic from '../../api/network/webSocket/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: 'WebSocket',
  apiName: 'webSocket',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_line, p_box, p_img, p_button } = require('../component/index');

    let socketState = p_box(PIXI, {
      height: 90 * PIXI.ratio,
    });

    // 绘制 on/off 开关按钮 start
    let off = p_img(PIXI, {
      width: 142 * PIXI.ratio,
      height: 90 * PIXI.ratio,
      src: 'images/off.png',
      x: socketState.width - 152 * PIXI.ratio,
      relative_middle: { containerHeight: socketState.height },
    });
    let on = p_img(PIXI, {
      width: 122 * PIXI.ratio,
      height: 87 * PIXI.ratio,
      src: 'images/on.png',
      x: socketState.width - 142 * PIXI.ratio,
    });
    on.hideFn();
    off.onClickFn(() => {
      logic.connectSocket();
    });
    on.onClickFn(() => {
      logic.closeSocket();
    });
    // 绘制 on/off 开关按钮 end

    socketState.addChild(
      p_text(PIXI, {
        content: 'Socket状态',
        fontSize: 30 * PIXI.ratio,
        x: 30 * PIXI.ratio,
        relative_middle: { containerHeight: socketState.height },
      }),
      off,
      on,
    );

    let news = p_box(PIXI, {
      height: socketState.height,
      y: socketState.y + socketState.height,
    });
    news.addChild(
      p_text(PIXI, {
        content: '消息',
        fontSize: 30 * PIXI.ratio,
        x: 30 * PIXI.ratio,
        relative_middle: { containerHeight: news.height },
      }),
      p_text(PIXI, {
        content: 'Hello,小游戏!',
        fontSize: 30 * PIXI.ratio,
        fill: 0x999999,
        x: news.width - 210 * PIXI.ratio,
        relative_middle: { containerHeight: news.height },
      }),
    );

    let box = p_box(PIXI, {
      height: news.y + news.height,
      border: {
        width: PIXI.ratio,
        color: 0x999999,
      },
      y: underline ? underline.y + underline.height + 80 * PIXI.ratio : 80 * PIXI.ratio,
    });

    box.addChild(
      socketState,
      p_line(
        PIXI,
        {
          width: PIXI.ratio | 0,
          color: 0x999999,
        },
        [30 * PIXI.ratio, socketState.height],
        [socketState.width - 30 * PIXI.ratio, 0],
      ),
      news,
    );

    // 点我发送 "按钮" 开始
    let button = p_button(PIXI, {
        y: box.y + box.height + 110 * PIXI.ratio,
        width: obj.width / 2,
        height: 80 * PIXI.ratio,
        alpha: 0,
      }),
      sendText = p_text(PIXI, {
        content: '点我发送',
        fontSize: 30 * PIXI.ratio,
        fill: 0x999999,
        relative_middle: { containerWidth: button.width, containerHeight: button.height },
      });
    button.myAddChildFn(sendText);
    button.onClickFn(() => {
      logic.sendMessage();
    });
    button.isTouchable(false);
    // 点我发送 "按钮" 结束

    // 回调：更新 UI 状态
    logic.setOnStatus((connected: boolean) => {
      if (connected) {
        off.hideFn();
        on.showFn();
        button.isTouchable(true);
        button.turnColors({ color: 0x07C160, alpha: 1 });
        sendText.turnColors(0xffffff);
      } else {
        off.showFn();
        on.hideFn();
        button.isTouchable(false);
        button.turnColors();
        sendText.turnColors(0x999999);
      }
    });

    const container = new PIXI.Container();
    container.addChild(box, button);
    return container;
  },

  actions: [],

  onUnload: () => logic.onUnload(),
};
