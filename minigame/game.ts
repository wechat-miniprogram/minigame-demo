declare global {
  interface Window {
    router: {
      navigateTo: (pathName: string, query?: any, options?: any) => void;
      navigateBack: () => void;
      delPage: () => void;
      getNowPageName: () => string;
      getNowPageLabel: () => string;
      getNowPage: (callback: (page: any) => void) => void;
    };
    query?: any;
  }
  const canvas: HTMLCanvasElement & {
    toTempFilePathSync(options?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      destWidth?: number;
      destHeight?: number;
      fileType?: string;
      quality?: number;
    }): string;
    toTempFilePath(options?: any): void;
  };
}

import './js/vendor/weapp-adapter';
import * as PIXI from './js/vendor/pixi.min';
import pmgressBar from './js/libs/pmgressBar';
import share from './js/libs/share';
import { resolvePathName } from './js/libs/sceneMap';

wx.cloud.init({ env: 'example-69d3b' });

wx.updateShareMenu({
  withShareTicket: true,
});

const { pixelRatio, windowWidth, windowHeight } = wx.getSystemInfoSync();

// 初始化canvas
const app = new PIXI.Application({
  width: windowWidth * pixelRatio,
  height: windowHeight * pixelRatio,
  view: canvas,
  backgroundColor: 0xEDEDED,
  preserveDrawingBuffer: true,
  antialias: true,
  resolution: 1,
  forceCanvas: true,
});

// 暴露给横竖屏切换等模块使用
(globalThis as any).__pixiApp = app;

// 因为在微信小游戏里canvas肯定是全屏的，所以映射起来就很简单暴力
PIXI.interaction.InteractionManager.prototype.mapPositionToPoint = (
  point,
  x,
  y
) => {
  point.x = x * pixelRatio;
  point.y = y * pixelRatio;
};

PIXI.ratio = (windowWidth * pixelRatio) / 750;

// 显示进度条（图片加载 + 分包加载期间可见）
const loadingFn = pmgressBar(PIXI, app, {
  width: windowWidth * pixelRatio,
  height: windowHeight * pixelRatio,
});

PIXI.loader
  .add([
    'images/official.png',
    'images/APIicon.png',
    'images/right_arrow.png',
    'images/right_arrow_black.png',
    'images/star.png',
    'images/customerService.png',
    'images/off.png',
    'images/on.png',
    'images/pitch_on.png',
  ])
  .load(() => {
    wx.loadSubpackage({
      name: 'api',
      success() {
        const router = require('./js/api/game'),
          options = wx.getLaunchOptionsSync(),
          query = options.query;

        router(PIXI, app, {
          width: windowWidth * pixelRatio,
          height: windowHeight * pixelRatio,
          pixelRatio,
        });

        share(); //全局分享

        // 解析 scene 参数或直接用 pathName
        const launchPathName = resolvePathName(query);
        if (launchPathName) {
          window.router.navigateTo(
            launchPathName,
            { ...query, pathName: launchPathName },
            options
          );
        }

        wx.onShow((res) => {
          const q = Object.assign(window.query || {}, res.query);
          const showPathName = resolvePathName(q);
          const noNavigateToRequired = !['VoIPChat'].includes(
            showPathName || ''
          );

          if (showPathName) {
            noNavigateToRequired && window.router.navigateBack();

            !window.query &&
              !noNavigateToRequired &&
              window.router.navigateTo(
                showPathName,
                { ...q, pathName: showPathName },
                res
              );

            noNavigateToRequired &&
              window.router.navigateTo(
                showPathName,
                { ...q, pathName: showPathName },
                res
              );
          }

          noNavigateToRequired && (window.query = null);
        });

        loadingFn(100);
      },
      fail() {
        console.error('loadSubpackage fail');
      },
      complete() {
        console.log('loadSubpackage complete');
      },
    }).onProgressUpdate((res) => {
      loadingFn(res.progress);
    });
  });
