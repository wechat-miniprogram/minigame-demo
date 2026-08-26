/**
 * 渲染帧率
 * wx.setPreferredFramesPerSecond
 */

export let currentFPS = 60;
let _onFPSChange: ((fps: number) => void) | null = null;
/** 由 rich-configs 绑定 */
export function setOnFPSChange(fn: ((fps: number) => void) | null) {
  _onFPSChange = fn;
}

/** 设置渲染帧率（1~60） */
export function setFPS(value: number) {
  currentFPS = value;
  wx.setPreferredFramesPerSecond(value);
  if (_onFPSChange) _onFPSChange(value);
}

/** 页面销毁时恢复默认帧率 */
export function onUnload() {
  wx.setPreferredFramesPerSecond(60);
  _onFPSChange = null;
}
