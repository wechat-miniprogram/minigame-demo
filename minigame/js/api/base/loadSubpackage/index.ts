/**
 * 分包加载
 * wx.loadSubpackage / wx.preDownloadSubpackage
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/subpackage/wx.loadSubpackage.html
 *
 * 注意：本 demo 已有 chattool / lockstep 两个分包（见 game.json），
 * 由 router 在用户进入对应页面时按需加载，这里仅做 API 用法演示。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮加载或预下载分包，进度和结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'loadSubpackage';
const DEMO_SUBPACKAGE = 'chattool'; // 复用项目里已有的分包名

/** 加载指定分包 */
export function loadSubpackage() {
  wx.showToast({ title: '开始加载分包...', icon: 'none', duration: 1000 });

  const task = wx.loadSubpackage({
    name: DEMO_SUBPACKAGE,
    success() {
      wx.showToast({ title: `分包加载成功：${DEMO_SUBPACKAGE}`, icon: 'none', duration: 1000 });
    },
    fail(err: any) {
      wx.showToast({ title: `加载失败：${err?.errMsg || '未知错误'}`, icon: 'none', duration: 1000 });
    },
    complete() {},
  });

  if (task && task.onProgressUpdate) {
    task.onProgressUpdate((res: any) => {
      // progress 在分包已缓存时可能返回异常负值，需 clamp 到 0~100
      const progress = Math.max(0, Math.min(100, res.progress ?? 0));
      setInfo(
        formatObj({
          进度: `${progress}%`,
          已下载: `${res.totalBytesWritten} B`,
          总大小: `${res.totalBytesExpectedToWrite} B`,
        })
      );
    });
  }
}

/** 预下载分包（不执行，仅下载） */
export function preDownloadSubpackage() {
  wx.showToast({ title: '开始预下载分包...', icon: 'none', duration: 1000 });

  const task = wx.preDownloadSubpackage({
    name: DEMO_SUBPACKAGE,
    success() {
      wx.showToast({ title: '预下载完成', icon: 'none', duration: 1000 });
    },
    fail(err: any) {
      wx.showToast({ title: `预下载失败：${err?.errMsg || '未知错误'}`, icon: 'none', duration: 1000 });
    },
    complete() {},
  });

  if (task && task.onProgressUpdate) {
    task.onProgressUpdate((res: any) => {
      const progress = Math.max(0, Math.min(100, res.progress ?? 0));
      setInfo(
        formatObj({
          预下载进度: `${progress}%`,
          已下载: `${res.totalBytesWritten} B`,
          总大小: `${res.totalBytesExpectedToWrite} B`,
        })
      );
    });
  }
}
