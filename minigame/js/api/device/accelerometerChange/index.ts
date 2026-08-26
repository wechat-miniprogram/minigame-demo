/**
 * 重力感应
 * wx.startAccelerometer / wx.stopAccelerometer / wx.onAccelerometerChange
 */

let monitorFunc: any = null;
let _onData: ((res: { x: number; y: number; z: number }) => void) | null = null;
/** 由 rich-configs 绑定 */
export function setOnData(fn: ((res: any) => void) | null) {
  _onData = fn;
}

/** 是否为 PC 平台（重力感应仅支持移动端） */
function isPC() {
  const { platform } = wx.getSystemInfoSync();
  return platform === 'windows' || platform === 'mac';
}

/** 开始监听加速度变化（PC 平台返回 false 表示未启动） */
export function startListening(): boolean {
  if (isPC()) {
    wx.showToast({ title: '重力感应仅支持移动端', icon: 'none', duration: 1500 });
    return false;
  }
  wx.startAccelerometer({
    interval: 'game',
    fail(err: any) {
      console.error('启动加速度监听失败：', err?.errMsg || '未知错误');
    },
  });
  if (monitorFunc) return;
  wx.onAccelerometerChange(
    (monitorFunc = (res: any) => {
      if (_onData) _onData(res);
    })
  );
  return true;
}

/** 停止监听加速度 */
export function stopListening() {
  wx.stopAccelerometer({
    fail(err: any) {
      console.error('停止加速度监听失败：', err?.errMsg || '未知错误');
    },
  });
  if (monitorFunc && wx.offAccelerometerChange) {
    wx.offAccelerometerChange(monitorFunc);
    monitorFunc = null;
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  stopListening();
  _onData = null;
}
