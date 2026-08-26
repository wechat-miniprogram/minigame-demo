/**
 * 屏幕亮度
 * wx.getScreenBrightness / wx.setScreenBrightness
 */

let _onBrightnessChange: ((value: number) => void) | null = null;
/** 由 rich-configs 绑定 */
export function setOnBrightnessChange(fn: ((value: number) => void) | null) {
  _onBrightnessChange = fn;
}

/** 获取当前屏幕亮度 */
export function getScreenBrightness() {
  wx.getScreenBrightness({
    success(res: any) {
      if (_onBrightnessChange) _onBrightnessChange(res?.value);
    },
    fail(err: any) {
      wx.showToast({ title: `获取亮度失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 设置屏幕亮度（0~1） */
export function setScreenBrightness(value: number) {
  if (typeof value !== 'number' || value < 0 || value > 1) {
    wx.showToast({ title: '亮度值须在 0~1 之间', icon: 'none' });
    return;
  }
  wx.setScreenBrightness({
    value,
    fail(err: any) {
      wx.showToast({ title: `设置亮度失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
  if (_onBrightnessChange) _onBrightnessChange(value);
}

/** 页面销毁时清理 */
export function onUnload() {
  _onBrightnessChange = null;
}
