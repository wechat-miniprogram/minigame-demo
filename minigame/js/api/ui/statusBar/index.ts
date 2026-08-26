/**
 * 状态栏
 * wx.setStatusBarStyle
 *
 * 注意：此 API 只有在游戏主动配置了 showStatusBar 并且在 iOS 下才生效。
 * 当在配置中设置 showStatusBar 时，屏幕顶部会显示状态栏。
 * 此接口可以修改状态栏的样式（深色/浅色）。
 *
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/status-bar/wx.setStatusBarStyle.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '注意：此 API 仅在以下条件同时满足时生效：\n1. game.json 配置中已设置 showStatusBar\n2. 运行环境为 iOS\n配置 showStatusBar 后屏幕顶部会显示状态栏，此接口可修改其样式。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'statusBar';
/** 设置状态栏为深色样式（白字） */
export function setStatusBarDark() {
  wx.setStatusBarStyle({
    style: 'black',
    success() {
      wx.showToast({ title: '状态栏已设为深色（白字）', icon: 'none', duration: 1000 });
    },
    fail(err: any) {
      setInfo(
        formatObj({
          状态: '设置失败',
          原因: err?.errMsg || '未知错误',
        })
      );
    },
  });
}

/** 设置状态栏为浅色样式（黑字） */
export function setStatusBarLight() {
  wx.setStatusBarStyle({
    style: 'white',
    success() {
      wx.showToast({ title: '状态栏已设为浅色（黑字）', icon: 'none', duration: 1000 });
    },
    fail(err: any) {
      setInfo(
        formatObj({
          状态: '设置失败',
          原因: err?.errMsg || '未知错误',
        })
      );
    },
  });
}
