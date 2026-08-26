/**
 * VisionKit 基础
 *
 * 使用 VKSession v1 的 plane 追踪模式，
 * 触碰屏幕任意位置进行 hitTest，命中平面则放置跳舞的 3D 机器人。
 *
 * 微信 API: wx.createVKSession
 * 文档: developers.weixin.qq.com/minigame/dev/api/ai/visionkit/wx.createVKSession.html
 * 注意: 仅真机可用，需相机权限
 */

import type { ARModuleConfig } from '../../../libs/rich-configs/aiAr';

// ============== wx API 调用 ==============

let vkSession: any = null;

/** 创建并启动 VKSession */
export function startSession() {
  // 1. 创建 VKSession（v1 平面追踪）
  try {
    vkSession = wx.createVKSession({
      version: 'v1',
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
        // frame.getDisplayTransform() → 显示变换矩阵
        // frame.camera → 相机矩阵（viewMatrix / projectionMatrix）

        // 4. hitTest：将屏幕坐标转为 3D 空间命中点
        const hitTestRes = vkSession!.hitTest(0.5, 0.5);
        if (hitTestRes.length) {
          // hitTestRes[0].transform → 命中平面的变换矩阵
          // 可在此放置 3D 模型
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
// arConfig 由 libs/ar/arRenderer.ts 消费，驱动完整的 AR 渲染管线
// （Three.js 3D 渲染 + YUV 相机背景 + hitTest 放置模型）

export const arConfig: ARModuleConfig = {
  title: 'VisionKit基础',
  apiName: 'visionkit-basic',
  tip: '提示：触碰屏幕任意点,\n可在对应位置生成示例的机器小人',
  buttonName: null,
  mode: 'default',
  vkConfig: {
    track: {
      plane: { mode: 3 },
    },
    version: 'v1',
  },
};
