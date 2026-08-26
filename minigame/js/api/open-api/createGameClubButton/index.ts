/**
 * 游戏圈
 * wx.getGameClubData / wx.createGameClubButton
 * GameClubButton.destroy / GameClubButton.hide / GameClubButton.offTap /
 * GameClubButton.onTap / GameClubButton.show
 *
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/game-club/wx.createGameClubButton.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/game-club/wx.getGameClubData.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮创建游戏圈按钮组件，状态信息将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'createGameClubButton';

let clubBtn: any = null;

/** 获取游戏圈数据 */
export function getGameClubData() {
  wx.showToast({ title: '正在获取游戏圈数据...', icon: 'none' });
  wx.getGameClubData({
    dataTypeList: [{ type: 1 }],
    success(res: any) {
      if (!res || JSON.stringify(res) === '{}') {
        wx.showToast({ title: '游戏圈数据为空', icon: 'none' });
        return;
      }
      setInfo(`游戏圈数据\n${JSON.stringify(res, null, 2)}`);
    },
    fail(err: any) {
      setInfo(`获取游戏圈数据失败\n${err?.errMsg || '未知错误'}`);
    },
    complete() {
      wx.showToast({ title: 'getGameClubData 请求完成', icon: 'none' });
    },
  });
}

/** 创建游戏圈按钮 (GameClubButton) */
export function createGameClubButton() {
  const sysInfo = wx.getSystemInfoSync();
  const pixelRatio = sysInfo.pixelRatio || 2;
  const windowWidth = sysInfo.windowWidth || 375;
  const ratio = (windowWidth * pixelRatio) / 750;

  // 对齐 fixedTemplate 中 goBack 按钮的位置：
  //   goBack.y = menuBtn.top * ratio * 2 - 22 * ratio
  //   goBack.height = 80 * ratio
  // 把原生按钮放在 goBack 正下方（标题左侧空白区），
  // 左边与下方绿色函数按钮对齐，避免写死 top: 600 被 infoArea 长文本遮挡。
  const menuBtn = wx.getMenuButtonBoundingClientRect();
  const goBackBottom = (menuBtn.top * ratio * 2 - 22 * ratio) + 80 * ratio;
  // 绿色函数按钮左边距：btnX = (obj.width - 580*ratio) / 2
  const btnLeft = (windowWidth * pixelRatio - 580 * ratio) / 2;
  const btnTop = goBackBottom + 16 * ratio;
  const btnW = 160 * ratio;
  const btnH = 64 * ratio;

  clubBtn = wx.createGameClubButton({
    type: 'text',
    text: '游戏圈',
    style: {
      left: btnLeft / pixelRatio,
      top: btnTop / pixelRatio + 10,
      width: btnW / pixelRatio,
      height: btnH / pixelRatio,
      backgroundColor: '#07c160',
      color: '#ffffff',
      fontSize: 15,
      textAlign: 'center',
      lineHeight: Math.round(btnH / pixelRatio),
      borderRadius: 8,
    },
  } as any);
  clubBtn.onTap?.(() => {
    wx.showToast({ title: '游戏圈按钮被点击', icon: 'none' });
  });
  clubBtn.show?.();
  wx.showToast({ title: '游戏圈按钮已创建', icon: 'none' });
}

/** GameClubButton.show - 显示按钮 */
export function show() {
  if (!clubBtn) {
    wx.showToast({ title: '请先创建游戏圈按钮', icon: 'none' });
    return;
  }
  clubBtn.show?.();
  wx.showToast({ title: '游戏圈按钮已显示', icon: 'none' });
}

/** GameClubButton.hide - 隐藏按钮 */
export function hide() {
  if (!clubBtn) {
    wx.showToast({ title: '请先创建游戏圈按钮', icon: 'none' });
    return;
  }
  clubBtn.hide?.();
  wx.showToast({ title: '游戏圈按钮已隐藏', icon: 'none' });
}

/** GameClubButton.onTap - 监听点击事件 */
export function onTap() {
  if (!clubBtn) {
    wx.showToast({ title: '请先创建游戏圈按钮', icon: 'none' });
    return;
  }
  clubBtn.onTap?.(() => {
    wx.showToast({ title: 'onTap 回调触发', icon: 'none' });
  });
  wx.showToast({ title: 'onTap 监听已绑定', icon: 'none' });
}

/** GameClubButton.offTap - 取消监听点击事件 */
export function offTap() {
  if (!clubBtn) {
    wx.showToast({ title: '请先创建游戏圈按钮', icon: 'none' });
    return;
  }
  clubBtn.offTap?.();
  wx.showToast({ title: 'offTap 已取消监听', icon: 'none' });
}

/** GameClubButton.destroy - 销毁按钮 */
export function destroy() {
  if (clubBtn) {
    clubBtn.destroy?.();
    clubBtn = null;
    wx.showToast({ title: '游戏圈按钮已销毁', icon: 'none' });
  } else {
    wx.showToast({ title: '无游戏圈按钮可销毁', icon: 'none' });
  }
}

export function onUnload() {
  if (clubBtn) {
    clubBtn.destroy?.();
    clubBtn = null;
  }
}
