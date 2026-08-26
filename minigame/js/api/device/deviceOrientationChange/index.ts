/**
 * 横竖屏切换
 * wx.setDeviceOrientation
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮监听设备方向变化，事件通过 Toast 提示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'deviceOrientationChange';
function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

// ========== 原始尺寸（game.ts 初始化时的竖屏尺寸）==========
const sysInfo = wx.getSystemInfoSync();
const ORIG_W = sysInfo.windowWidth * sysInfo.pixelRatio;
const ORIG_H = sysInfo.windowHeight * sysInfo.pixelRatio;

/** 获取 PIXI app */
function getApp(): any {
  return (globalThis as any).__pixiApp;
}

/** 获取当前页面容器 */
function getPageContainer(): any | null {
  const router = (window as any).router;
  if (router) {
    let found: any = null;
    router.getNowPage((page: any) => {
      found = page?.page || null;
    });
    if (found) return found;
  }
  const app = getApp();
  if (app?.stage?.children?.length) {
    return app.stage.children[app.stage.children.length - 1];
  }
  return null;
}

/** 适配后的容器引用 */
let _adaptedContainer: any = null;

/**
 * 横屏适配：
 * - resize renderer 到横屏尺寸（宽高互换）
 * - scale 容器使其高度填满横屏高度
 * - 水平居中
 */
function applyLandscapeAdapt() {
  const app = getApp();
  const container = getPageContainer();
  if (!app || !container) {
    console.error('[orientation] no app or container');
    return;
  }

  // 横屏：宽高互换
  const landscapeW = ORIG_H;
  const landscapeH = ORIG_W;

  // resize renderer
  app.renderer.resize(landscapeW, landscapeH);

  // scale 容器：让容器高度（ORIG_H）适配横屏高度（landscapeH = ORIG_W）
  // scale = landscapeH / ORIG_H = ORIG_W / ORIG_H
  const scale = landscapeH / ORIG_H;

  // 居中
  const scaledW = ORIG_W * scale;
  const offsetX = (landscapeW - scaledW) / 2;

  container.scale.set(scale);
  container.x = offsetX;
  container.y = 0;

  _adaptedContainer = container;

  console.log('[orientation] landscape adapt:', {
    renderer: `${landscapeW}x${landscapeH}`,
    scale,
    offset: `${offsetX},0`,
  });
}

/** 恢复竖屏：renderer 恢复原尺寸 + 容器 scale=1 */
function resetToPortrait() {
  const app = getApp();
  if (app) {
    app.renderer.resize(ORIG_W, ORIG_H);
  }
  if (_adaptedContainer) {
    _adaptedContainer.scale.set(1);
    _adaptedContainer.x = 0;
    _adaptedContainer.y = 0;
    _adaptedContainer = null;
  }
}

/** 切换为横屏 */
export function switchToLandscape() {
  wx.setDeviceOrientation({
    value: 'landscape',
    success() {
      // 等待系统完成旋转
      setTimeout(() => {
        applyLandscapeAdapt();
        toast('已切换为横屏');
      }, 300);
    },
    fail(err: any) {
      toast(`失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 切换为竖屏 */
export function switchToPortrait() {
  wx.setDeviceOrientation({
    value: 'portrait',
    success() {
      setTimeout(() => {
        resetToPortrait();
        toast('已切换为竖屏');
      }, 300);
    },
    fail(err: any) {
      toast(`失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 页面卸载时切回竖屏并恢复 */
export function onUnload() {
  try {
    wx.setDeviceOrientation({ value: 'portrait' });
  } catch (e) {
    /* ignore */
  }
  resetToPortrait();
}
