/**
 * 设备方向
 * wx.startDeviceMotionListening / wx.stopDeviceMotionListening / wx.onDeviceMotionChange
 */

let monitorFunc: any = null;
let _onData:
  | ((res: { alpha: number; beta: number; gamma: number }) => void)
  | null = null;
/** 由 rich-configs 绑定 */
export function setOnData(fn: ((res: any) => void) | null) {
  _onData = fn;
}

/** 是否为 PC 平台（设备方向仅支持移动端） */
function isPC() {
  const { platform } = wx.getSystemInfoSync();
  return platform === 'windows' || platform === 'mac';
}

/** 开始监听设备方向变化（PC 平台返回 false 表示未启动） */
export function startListening(): boolean {
  if (isPC()) {
    wx.showToast({ title: '设备方向仅支持移动端', icon: 'none', duration: 1500 });
    return false;
  }
  wx.startDeviceMotionListening({
    fail(err: any) {
      console.error('启动设备方向监听失败：', err?.errMsg || '未知错误');
    },
  });
  if (monitorFunc) return;
  wx.onDeviceMotionChange(
    (monitorFunc = (res: any) => {
      if (_onData) _onData(res);
    })
  );
  return true;
}

/** 停止监听设备方向 */
export function stopListening() {
  wx.stopDeviceMotionListening({
    fail(err: any) {
      console.error('停止设备方向监听失败：', err?.errMsg || '未知错误');
    },
  });
  if (monitorFunc && wx.offDeviceMotionChange) {
    wx.offDeviceMotionChange(monitorFunc);
    monitorFunc = null;
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  stopListening();
  _onData = null;
}
