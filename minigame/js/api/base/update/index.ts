/**
 * 更新
 * wx.updateWeChatApp / wx.getUpdateManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/update/wx.getUpdateManager.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮检查小程序更新或触发更新，状态信息将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'update';
/** 跳转到更新微信页面（当前微信版本过低时） */
export function updateWeChatApp() {
  wx.updateWeChatApp({
    fail(err: any) {
      setInfo(`无需更新或调用失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 检查更新（组合用法：注册所有回调并自动应用更新） */
export function checkUpdate() {
  const updateManager = wx.getUpdateManager();

  updateManager.onCheckForUpdate((res: any) => {
    wx.showToast({ title: res.hasUpdate ? '检测到小游戏新版本，正在下载...' : '当前小游戏已是最新版本', icon: 'none', duration: 1000 });
  });

  updateManager.onUpdateReady(() => {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success(res: any) {
        if (res.confirm) {
          updateManager.applyUpdate();
        }
      },
    });
  });

  updateManager.onUpdateFailed(() => {
    wx.showToast({ title: '新版本下载失败', icon: 'none', duration: 1000 });
  });
}

export function onUnload() {
  // UpdateManager 的监听无法注销，下次进入时复用同一个实例即可
}
