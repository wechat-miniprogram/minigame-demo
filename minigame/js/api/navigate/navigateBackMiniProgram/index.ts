/**
 * 返回上一个小程序
 * wx.navigateBackMiniProgram
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/navigate/wx.navigateBackMiniProgram.html
 *
 * 注意：只有在当前小游戏是被其他小程序打开时才能调用成功，
 * 否则会走 fail 回调。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮返回上一个小程序，操作结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'navigateBackMiniProgram';

/** 返回上一个小程序（不带数据） */
export function navigateBackMiniProgram() {
  wx.navigateBackMiniProgram({
    success(res: any) {
      console.log('[navigateBackMiniProgram] success', res);
    },
    fail(err: any) {
      setInfo(
        formatObj({
          状态: '返回失败',
          原因: err?.errMsg || '未知错误',
          提示: '仅在当前小游戏被其他小程序打开时可调用',
        })
      );
    },
  });
}

/** 返回并附带 extraData */
export function navigateBackWithExtra() {
  wx.navigateBackMiniProgram({
    extraData: { from: 'minigame-demo', ts: Date.now() },
    success(res: any) {
      console.log('[navigateBackMiniProgram] success', res);
    },
    fail(err: any) {
      setInfo(
        formatObj({
          状态: '返回失败',
          原因: err?.errMsg || '未知错误',
        })
      );
    },
  });
}
