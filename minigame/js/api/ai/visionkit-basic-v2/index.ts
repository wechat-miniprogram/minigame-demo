/**
 * VisionKit 基础 v2
 *
 * 使用 VKSession v2 的 plane 追踪模式，
 * 触碰屏幕任意位置进行 hitTest，命中平面则放置跳舞的 3D 机器人。
 * v2 与 v1 的区别：version 参数传 'v2'，追踪精度更高。
 *
 * 微信 API: wx.createVKSession
 * 文档: developers.weixin.qq.com/minigame/dev/api/ai/visionkit/wx.createVKSession.html
 * 注意: 仅真机可用，需相机权限
 */

import type { ARModuleConfig } from '../../../libs/rich-configs/aiAr';

// ============== wx API 调用 ==============

let vkSession: any = null;

/** 创建并启动 VKSession（v2） */
export function startSession() {
  // 1. 创建 VKSession（v2 平面追踪）
  try {
    vkSession = wx.createVKSession({
      version: 'v2',
      track: { plane: { mode: 3 } },
    });
  } catch (e: any) {
    wx.showToast({ title: '当前设备不支持', icon: 'none' });
    return;
  }

  // 2. 启动 session
  vkSession.start((errCode) => {
    if (errCode) {
      wx.showToast({ title: '当前设备不支持', icon: 'none' });
      return;
    }
    console.log('VKSession.version', vkSession!.version);

    // 3. 逐帧获取相机数据
    const onFrame = (_timestamp: number) => {
      const frame = vkSession!.getVKFrame(
        window.innerWidth,
        window.innerHeight
      );
      if (frame) {
        // frame.getCameraTexture(gl, 'yuv') → 相机画面纹理
        // frame.camera → 相机矩阵（viewMatrix / projectionMatrix）

        // 4. hitTest：屏幕坐标 → 3D 空间命中点
        const hitTestRes = vkSession!.hitTest(0.5, 0.5);
        if (hitTestRes.length) {
          console.log('命中平面', hitTestRes[0].transform);
        }
      }
      vkSession!.requestAnimationFrame(onFrame);
    };
    vkSession!.requestAnimationFrame(onFrame);
  });
}

/** 停止并销毁 VKSession */
export function stopSession() {
  if (vkSession) {
    vkSession.stop();
    vkSession.destroy();
    vkSession = null;
  }
}

export function onUnload() {
  stopSession();
}

// ============== AR 可视化渲染配置 ==============

export const arConfig: ARModuleConfig = {
  title: 'VisionKit基础-v2',
  apiName: 'visionkit-basic-v2',
  tip: '提示：v2版本识别平面, 触碰屏幕任意点,\n在平面位置会生成示例的机器小人',
  buttonName: null,
  mode: 'default',
  vkConfig: {
    track: {
      plane: { mode: 3 },
    },
    version: 'v2',
  },
};
