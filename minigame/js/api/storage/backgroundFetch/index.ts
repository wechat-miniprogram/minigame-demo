/**
 * 周期性后台数据更新
 * wx.setBackgroundFetchToken / wx.getBackgroundFetchToken
 * wx.getBackgroundFetchData / wx.onBackgroundFetchData
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮设置 Token 或拉取周期性后台数据。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'backgroundFetch';

let listener: any = null;

/** 设置 BackgroundFetch token */
export function setBackgroundFetchToken() {
  (wx as any).setBackgroundFetchToken({
    token: 'demo_token_' + Date.now(),
    success() {
      setInfo('设置 token 成功');
    },
    fail(err: any) {
      setInfo(`设置 token 失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 查询 BackgroundFetch token */
export function getBackgroundFetchToken() {
  wx.getBackgroundFetchToken({
    success(res: any) {
      setInfo(`token: ${res.token || '空'}`);
    },
    fail(_err: any) {
      setInfo('查询失败（需先在 mp 后台配置）');
    },
  });
}

/** 主动获取 backgroundFetch 数据 */
export function getBackgroundFetchData() {
  wx.getBackgroundFetchData({
    fetchType: 'pre',
    success(res: any) {
      setInfo(`fetchedData: ${String(res.fetchedData || '')}`);
    },
    fail(err: any) {
      setInfo(`获取失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 监听 backgroundFetch 数据推送 */
export function onBackgroundFetchData() {
  listener = (res: any) => {
    setInfo(`收到推送: ${String(res.fetchedData || '')}`);
  };
  wx.onBackgroundFetchData(listener);
  setInfo('已注册 onBackgroundFetchData 监听');
}

export function onUnload() {
  if (listener) {
    (wx as any).offBackgroundFetchData?.(listener);
  }
  listener = null;
}
