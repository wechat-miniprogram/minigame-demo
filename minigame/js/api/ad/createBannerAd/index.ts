/**
 * Banner 广告
 * wx.createBannerAd
 */

export const setDisplay = () => {};

import { createInfoArea } from '../../../libs/info-area';
const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮创建/显示/隐藏/销毁 Banner 广告。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'createBannerAd';

let bannerAd: any = null;

/** 创建并显示 Banner 广告 */
export function createBannerAd() {
  const sysInfo = wx.getSystemInfoSync();
  const windowWidth = sysInfo?.windowWidth || 375;
  const windowHeight = sysInfo?.windowHeight || 667;
  // Banner 展示在屏幕下半部分，避免遮挡 infoArea 和按钮区域
  const bannerHeight = 120;
  bannerAd = wx.createBannerAd({
    adUnitId: 'adunit-2e20328227ca771b',
    adIntervals: 30,
    style: {
      left: 0,
      top: windowHeight * 0.75,
      width: windowWidth,
      height: bannerHeight,
    },
  });

  if (!bannerAd) {
    setInfo('创建 Banner 广告失败，当前环境可能不支持');
    return;
  }

  bannerAd.onLoad(() => {
    setInfo('Banner 广告加载成功，点击 show 可展示');
  });

  bannerAd.onError((res: any) => {
    setInfo(`调用失败：${res?.errMsg || '未知错误'}`);
  });
}

/** 显示广告 */
export function show() {
  if (bannerAd) {
    bannerAd.show();
    setInfo('Banner 广告已显示');
  } else {
    wx.showToast({ title: '请先创建 Banner 广告', icon: 'none' });
  }
}

/** 隐藏广告 */
export function hide() {
  if (bannerAd) {
    bannerAd.hide();
    setInfo('Banner 广告已隐藏');
  }
}

/** 销毁广告 */
export function destroy() {
  if (bannerAd) {
    bannerAd.hide();
    bannerAd.destroy();
    bannerAd = null;
    setInfo('Banner 广告已销毁');
  }
}

export function onUnload() {
  if (bannerAd) {
    bannerAd.hide();
    bannerAd.destroy();
    bannerAd = null;
  }
}
