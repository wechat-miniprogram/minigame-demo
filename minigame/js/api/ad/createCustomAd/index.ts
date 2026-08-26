/**
 * 自定义广告
 * wx.createCustomAd
 */

export const setDisplay = () => {};

import { createInfoArea } from '../../../libs/info-area';
const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮创建/显示/隐藏/销毁自定义广告。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'createCustomAd';

let customAd: any = null;

/** 创建自定义广告 */
export function createCustomAd() {
  const win = wx.getWindowInfo();
  customAd = (wx as any).createCustomAd({
    adUnitId: 'adunit-2e20328227ca771b',
    adIntervals: 30,
    style: {
      left: 0,
      top: win.windowHeight - 150,
      width: win.windowWidth,
      fixed: true,
    },
  });

  if (!customAd) {
    setInfo('创建自定义广告失败');
    return;
  }

  customAd.onLoad(() => setInfo('自定义广告加载完成，点击 show 展示'));
  customAd.onError((err: any) => setInfo(`调用失败：${err?.errMsg || '未知错误'}`));
  customAd.onClose(() => setInfo('用户关闭了广告'));
}

/** 显示自定义广告 */
export function show() {
  if (customAd) {
    customAd
      .show()
      .then(() => setInfo('自定义广告已展示'))
      .catch((err: any) => setInfo(`展示失败: ${err?.errMsg || '未知错误'}`));
  } else {
    wx.showToast({ title: '请先创建自定义广告', icon: 'none' });
  }
}

/** 隐藏自定义广告 */
export function hide() {
  if (customAd) {
    customAd.hide();
    setInfo('已隐藏自定义广告');
  }
}

/** 销毁自定义广告 */
export function destroy() {
  if (customAd) {
    customAd.destroy();
    customAd = null;
    setInfo('已销毁自定义广告');
  }
}

export function onUnload() {
  if (customAd) {
    customAd.hide();
    customAd.destroy();
    customAd = null;
  }
}
