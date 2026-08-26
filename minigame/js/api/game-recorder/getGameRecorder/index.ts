/**
 * 游戏对局回放
 * wx.getGameRecorder / wx.createGameRecorderShareButton / wx.operateGameRecorderVideo
 */

import { createInfoArea } from '../../../libs/info-area';

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮开始/停止录制，录制完成后可生成分享。PC 端不支持此功能。'
);
export { onInfoTextReady, infoArea };

let gr: any = null;
let shareButton: any = null;
let writeTime = 0;

// 原生分享按钮的样式（由 rich-config 计算后注入）
let shareButtonStyle: { left: number; top: number; width: number; height: number } | null = null;

/** 是否为 PC 平台 */
function isPC() {
  const { platform } = wx.getSystemInfoSync();
  return platform === 'windows' || platform === 'mac';
}

/** 注入原生分享按钮的位置和尺寸（供 rich-config 调用） */
export function setShareButtonStyle(style: { left: number; top: number; width: number; height: number }) {
  shareButtonStyle = style;
}

export function onLoad() {
  if (isPC()) {
    console.log('[game-recorder] PC 端不支持游戏对局回放');
    return;
  }
  try {
    gr = wx.getGameRecorder();
    if (!gr) {
      console.error('[game-recorder] wx.getGameRecorder() 返回空');
    }
  } catch (e: any) {
    console.error('[game-recorder] getGameRecorder 失败', e);
  }
}

/** 检查录制器是否可用，PC 端或 gr 未就绪时提示并返回 false */
function checkReady(): boolean {
  if (isPC()) {
    wx.showToast({ title: '该功能仅支持移动端', icon: 'none', duration: 1000 });
    return false;
  }
  if (!gr) {
    wx.showToast({ title: '录制器未就绪，当前环境可能不支持', icon: 'none', duration: 1000 });
    return false;
  }
  return true;
}

/** 开始录制 */
export function startGameRecord() {
  if (!checkReady()) return;
  writeTime = 0;
  wx.showToast({ title: '正在启动录制...', icon: 'none', duration: 1000 });
  gr.start()
    .then((res: any) => {
      if (res.error?.code) {
        wx.showToast({ title: `录屏错误: ${res.error.code} ${res.error.message}`, icon: 'none', duration: 1000 });
        return;
      }
      gr.on('timeUpdate', (r: any) => {
        writeTime = Math.min(r.currentTime, 60000);
      });
      wx.showToast({ title: '录制已开始', icon: 'none', duration: 1000 });
    })
    .catch((err: any) => {
      wx.showToast({ title: `启动失败: ${err?.errMsg || err?.message || err}`, icon: 'none', duration: 1000 });
    });
}

/** 暂停录制 */
export function pause() {
  if (!checkReady()) return;
  gr.pause()
    .then((res: any) => {
      if (res.error?.code) {
        wx.showToast({ title: `暂停错误: ${res.error.message}`, icon: 'none', duration: 1000 });
        return;
      }
      wx.showToast({ title: '已暂停录制', icon: 'none', duration: 1000 });
    })
    .catch((err: any) => {
      wx.showToast({ title: `暂停失败: ${err?.errMsg || err}`, icon: 'none', duration: 1000 });
    });
}

/** 继续录制 */
export function resume() {
  if (!checkReady()) return;
  gr.resume()
    .then((res: any) => {
      if (res.error?.code) {
        wx.showToast({ title: `恢复错误: ${res.error.message}`, icon: 'none', duration: 1000 });
        return;
      }
      wx.showToast({ title: '已继续录制', icon: 'none', duration: 1000 });
    })
    .catch((err: any) => {
      wx.showToast({ title: `恢复失败: ${err?.errMsg || err}`, icon: 'none', duration: 1000 });
    });
}

/** 停止录制 */
export function stopGameRecord() {
  if (!checkReady()) return;
  if (writeTime < 2000) {
    wx.showToast({ title: '录屏时间需大于2秒才能停止', icon: 'none', duration: 1000 });
    return;
  }
  gr.stop()
    .then((res: any) => {
      if (res.error?.code) {
        wx.showToast({ title: `停止错误: ${res.error.message}`, icon: 'none', duration: 1000 });
        return;
      }
      gr.off('timeUpdate');
      wx.showToast({ title: `录制完成，时长${writeTime}ms`, icon: 'none', duration: 1000 });

      // 创建分享录制视频按钮（样式对齐绿色函数按钮）
      if (!shareButton) {
        const s = shareButtonStyle || { left: 100, top: 650, width: 290, height: 40 };
        shareButton = wx.createGameRecorderShareButton({
          style: {
            left: s.left,
            top: s.top,
            width: s.width,
            height: s.height,
            backgroundColor: '#05c25f',
            color: '#ffffff',
            fontSize: 15,
            borderRadius: 10,
            textAlign: 'center',
          } as any,
          text: '分享录制视频',
          share: {
            query: 'test=test',
            timeRange: [[0, writeTime]],
          } as any,
        });
      } else {
        shareButton.share!.timeRange = [[0, writeTime]];
      }
      shareButton.show();
      shareButton.onTap((r: any) => {
        wx.showToast({
          title: r.error ? `分享错误: ${r.error.message}` : '分享完成',
          icon: 'none',
          duration: 1000,
        });
      });
    })
    .catch((err: any) => {
      wx.showToast({ title: `停止失败: ${err?.errMsg || err}`, icon: 'none', duration: 1000 });
    });
}

/** 放弃录制 */
export function abort() {
  if (!checkReady()) return;
  gr.abort()
    .then((res: any) => {
      if (res.error?.code) {
        wx.showToast({ title: `放弃错误: ${res.error.message}`, icon: 'none', duration: 1000 });
        return;
      }
      gr.off('timeUpdate');
      writeTime = 0;
      wx.showToast({ title: '已放弃录制', icon: 'none', duration: 1000 });
    })
    .catch((err: any) => {
      wx.showToast({ title: `放弃失败: ${err?.errMsg || err}`, icon: 'none', duration: 1000 });
    });
}

/** 通过 API 分享对局回放（支持分享到游戏圈/会话） */
export function operateGameRecorderVideo() {
  if (!checkReady()) return;
  if (writeTime < 2000) {
    wx.showToast({ title: '请先录制至少2秒的对局回放', icon: 'none', duration: 1000 });
    return;
  }
  (wx as any).operateGameRecorderVideo({
    title: '对局回放',
    desc: '精彩瞬间',
    query: 'from=gameRecorder',
    bgm: 'js/api/game-recorder/getGameRecorder/bgm.mp3',
    timeRange: [[0, Math.min(writeTime, 60000)]],
    volume: 0.8,
    atempo: 1,
    audioMix: true,
    success() {
      wx.showToast({ title: '分享对局回放成功', icon: 'none', duration: 1000 });
    },
    fail(err: any) {
      wx.showToast({ title: `分享失败: ${err?.errMsg || '未知错误'}`, icon: 'none', duration: 1000 });
    },
  });
}

export function onUnload() {
  if (shareButton) {
    shareButton.hide();
    shareButton = null;
  }
  if (gr) {
    gr.off('timeUpdate');
  }
  writeTime = 0;
}
