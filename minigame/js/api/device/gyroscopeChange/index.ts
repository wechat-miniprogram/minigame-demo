/**
 * 陀螺仪
 * wx.startGyroscope / wx.stopGyroscope / wx.onGyroscopeChange
 */

let monitorFunc: any = null;
let _onData: ((res: { x: number; y: number; z: number }) => void) | null = null;
/** 由 rich-configs 绑定 */
export function setOnData(fn: ((res: any) => void) | null) {
  _onData = fn;
}

/** 是否为 PC 平台（陀螺仪仅支持移动端） */
function isPC() {
  const { platform } = wx.getSystemInfoSync();
  return platform === 'windows' || platform === 'mac';
}

/** 开始监听陀螺仪数据（PC 平台返回 false 表示未启动） */
export function startListening(): boolean {
  if (isPC()) {
    wx.showToast({ title: '陀螺仪仅支持移动端', icon: 'none', duration: 1500 });
    return false;
  }
  wx.startGyroscope({
    fail(err: any) {
      console.error('启动陀螺仪监听失败：', err?.errMsg || '未知错误');
    },
  });
  if (monitorFunc) return;
  wx.onGyroscopeChange(
    (monitorFunc = (res: any) => {
      if (_onData) _onData(res);
    })
  );
  return true;
}

/** 停止监听陀螺仪 */
export function stopListening() {
  wx.stopGyroscope({
    fail(err: any) {
      console.error('停止陀螺仪监听失败：', err?.errMsg || '未知错误');
    },
  });
  if (monitorFunc && wx.offGyroscopeChange) {
    wx.offGyroscopeChange(monitorFunc);
    monitorFunc = null;
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  stopListening();
  _onData = null;
}
