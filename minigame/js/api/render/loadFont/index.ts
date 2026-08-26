/**
 * 加载自定义字体文件
 * wx.loadFont
 */

let onLoadCb: ((font: string) => void) | null = null;

export function setOnLoad(cb: (font: string) => void) {
  onLoadCb = cb;
}

/** 加载自定义字体 */
export function loadFont() {
  const font = wx.loadFont('js/api/render/loadFont/assets/TencentSans-W7.subset.ttf');
  onLoadCb?.(font || '');
}

export function onUnload() {}
