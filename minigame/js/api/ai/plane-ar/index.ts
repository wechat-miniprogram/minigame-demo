/**
 * 水平面 AR
 *
 * 使用 VKSession 的 plane 追踪模式，
 * 在识别到的水平面上显示 reticle 光标（环形指示器），
 * 触碰屏幕可在光标位置放置跳舞的 3D 机器人模型。
 *
 * 微信 API: wx.createVKSession
 * 文档: developers.weixin.qq.com/minigame/dev/api/ai/visionkit/wx.createVKSession.html
 * 注意: 仅真机可用，需相机权限
 */

import type { ARModuleConfig } from '../../../libs/rich-configs/aiAr';

// ============== wx API 调用 ==============

let vkSession: any = null;

/** 创建并启动 VKSession（reticle 光标模式） */
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

    // 3. 逐帧渲染
    const onFrame = (_timestamp: number) => {
      const frame = vkSession!.getVKFrame(
        window.innerWidth,
        window.innerHeight
      );
      if (frame) {
        // 4. hitTest 检测屏幕中心（0.5, 0.5）是否命中平面
        const hitTestRes = vkSession!.hitTest(0.5, 0.5);
        if (hitTestRes.length) {
          // 命中平面 → 可在命中位置显示 reticle 光标
          // reticle.matrix.fromArray(hitTestRes[0].transform)
          // reticle.visible = true
          console.log('reticle 位置', hitTestRes[0].transform);
        } else {
          // 未命中平面 → 隐藏光标
          // reticle.visible = false
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
  title: '水平面AR',
  apiName: 'plane-ar',
  tip: '提示：触碰屏幕任意点,\n可在对应位置生成示例的机器小人,\n其中光标标记指示的是水平面',
  buttonName: null,
  mode: 'planeAR',
  vkConfig: {
    track: {
      plane: { mode: 3 },
    },
    version: 'v1',
  },
};
