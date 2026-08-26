/**
 * 激励视频广告
 * wx.createRewardedVideoAd
 */

export const setDisplay = () => {};

import { createInfoArea } from '../../../libs/info-area';
const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮加载/展示激励视频广告，观看完成后可触发奖励回调。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'createRewardedVideoAd';

let rewardedVideoAd: any = null;
let firstLoaded = false;

/** 创建激励视频广告 */
export function createRewardedVideoAd() {
  rewardedVideoAd = wx.createRewardedVideoAd({
    adUnitId: Math.round(Math.random())
      ? 'adunit-367ee566b15d46b3' // 长视频
      : 'adunit-52baa2f38c69b5f7', // 短视频
  });

  if (!rewardedVideoAd) {
    setInfo('创建激励视频广告失败，当前环境可能不支持');
    return;
  }

  firstLoaded = false;
  rewardedVideoAd.onLoad(() => {
    if (!firstLoaded) {
      firstLoaded = true;
      setInfo('激励视频加载成功，点击 show 播放');
    }
  });

  rewardedVideoAd.onError((err: any) => {
    setInfo(`调用失败：${err?.errMsg || '未知错误'}`);
  });

  rewardedVideoAd.onClose((res: any) => {
    if (res?.isEnded) {
      setInfo('完整观看，可发放奖励');
    } else {
      setInfo('中途退出，不发放奖励');
    }
  });

  rewardedVideoAd.load().catch((err: any) => {
    setInfo(`加载失败：${err?.errMsg || '未知错误'}`);
  });
}

/** 播放激励视频 */
export function show() {
  if (rewardedVideoAd) {
    rewardedVideoAd.show().catch((err) => {
        setInfo(`重新加载失败: ${err?.errMsg || '未知错误'}`);
    });
    setInfo('正在加载激励视频...');
  } else {
    wx.showToast({ title: '请先创建激励视频广告', icon: 'none' });
  }
}

/** 销毁激励视频 */
export function destroy() {
  if (rewardedVideoAd) {
    rewardedVideoAd.destroy();
    rewardedVideoAd = null;
    setInfo('激励视频广告已销毁');
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  if (rewardedVideoAd) {
    rewardedVideoAd.destroy();
    rewardedVideoAd = null;
  }
}
