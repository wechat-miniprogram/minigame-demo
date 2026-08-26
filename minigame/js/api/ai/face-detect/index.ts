/**
 * 实时人脸检测
 *
 * 使用 VKSession 的 face + plane 追踪模式，
 * 在摄像头画面中实时标记人脸位置（绿色关键点 + 红色边框）。
 * 支持前后摄像头切换。
 *
 * 微信 API: wx.createVKSession
 * 文档: developers.weixin.qq.com/minigame/dev/api/ai/visionkit/wx.createVKSession.html
 * 注意: 仅真机可用，需相机权限
 */

import type { ARModuleConfig } from '../../../libs/rich-configs/aiAr';

// ============== wx API 调用 ==============

let vkSession: any = null;

/** 创建并启动 VKSession（人脸检测模式） */
export function startSession() {
  // 1. 创建 VKSession（v1，同时追踪人脸和平面）
  try {
    vkSession = (wx as any).createVKSession({
      version: 'v1',
      track: {
        plane: { mode: 3 },
        face: { mode: 1 },
      },
      cameraPosition: 0,
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

    // 3. 监听人脸锚点事件
    vkSession!.on('addAnchors', (anchors) => {
      // anchors[].points → 人脸关键点坐标数组 [{x, y}, ...]
      // anchors[].origin → 人脸框左上角 {x, y}
      // anchors[].size → 人脸框尺寸 {width, height}
      console.log('检测到人脸', anchors.length);
    });
    vkSession!.on('updateAnchors', (anchors) => {
      // 每帧更新人脸位置（摄像头实时检测时每帧触发）
    });
    vkSession!.on('removeAnchors', () => {
      // 人脸离开画面
      console.log('人脸已离开');
    });

    // 4. 逐帧渲染
    const onFrame = (_timestamp: number) => {
      const frame = vkSession!.getVKFrame(
        window.innerWidth,
        window.innerHeight
      );
      if (frame) {
        // 渲染相机画面 + 人脸关键点(绿点) + 人脸边框(红框)
      }
      vkSession!.requestAnimationFrame(onFrame);
    };
    vkSession!.requestAnimationFrame(onFrame);
  });
}

/** 切换前后摄像头 */
export function switchCamera() {
  if (vkSession) {
    const config = vkSession.config as any;
    config.cameraPosition = config.cameraPosition === 0 ? 1 : 0;
  }
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
  title: '实时人脸检测',
  apiName: 'face-detect',
  tip: '提示：将摄像头对准人脸,\n检测到的人脸将会被标记出识别框和面部标记点',
  buttonName: '切换为前置摄像头',
  mode: 'faceDetect',
  vkConfig: {
    track: {
      plane: { mode: 3 },
      face: { mode: 1 },
    },
    cameraPosition: 0,
    version: 'v1',
  },
};
