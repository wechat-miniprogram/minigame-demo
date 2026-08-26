/**
 * 相机
 * wx.createCamera
 */

let camera: any = null;
let onResultCallback: ((res: any) => void) | null = null;

/** 设置结果回调，由 rich-config 调用 */
export function setOnResult(cb: (res: any) => void) {
  onResultCallback = cb;
}

/** 授权相机权限 */
function authorizeCamera(): Promise<void> {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res: any) {
        if (res.authSetting['scope.camera']) {
          resolve();
        } else {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              resolve();
            },
            fail: reject,
          });
        }
      },
      fail: reject,
    });
  });
}

/** 创建相机
 *  @param pos 可选的位置参数 {x, y, width, height}，由 rich-config 传入以控制布局
 *  @returns Promise<Camera> 相机实例，用于滚动同步 */
export function createCamera(pos?: { x?: number; y?: number; width?: number; height?: number }): Promise<any> {
  const { platform } = wx.getSystemInfoSync();
  if (platform === 'windows' || platform === 'mac') {
    wx.showToast({ title: '该功能仅支持移动端', icon: 'none', duration: 1000 });
    return Promise.resolve(null);
  }
  return authorizeCamera()
    .then(() => {
      if (camera) {
        camera.destroy();
        camera = null;
      }
      const sysInfo = wx.getSystemInfoSync();
      const windowWidth = sysInfo?.windowWidth || 375;
      const windowHeight = sysInfo?.windowHeight || 667;
      const camSize = pos?.width || Math.min(windowWidth, 300);
      const x = pos?.x ?? (windowWidth - camSize) / 2;
      const y = pos?.y ?? windowHeight * 0.6;

      camera = wx.createCamera({
        x,
        y,
        width: pos?.width || camSize,
        height: pos?.height || camSize,
        devicePosition: 'front',
      });
      wx.showToast({ title: '相机已创建', icon: 'none' });
      return camera;
    })
    .catch(() => {
      wx.showToast({ title: '需要授权相机权限才能使用相机', icon: 'none' });
      return null;
    });
}

/** 切换前后摄像头 */
export function switchCamera() {
  if (!camera) {
    wx.showToast({ title: '请先创建相机', icon: 'none' });
    return;
  }
  camera.devicePosition = camera.devicePosition === 'back' ? 'front' : 'back';
  wx.showToast({
    title: `切换到：${camera.devicePosition === 'front' ? '前置' : '后置'}摄像头`,
    icon: 'none',
  });
}

/** 拍照 */
export function takePhoto() {
  if (!camera) {
    wx.showToast({ title: '请先创建相机', icon: 'none' });
    return;
  }
  camera
    .takePhoto()
    .then((res: any) => {
      if (!res.tempImagePath) {
        wx.showToast({ title: '拍照失败：相机还没有完全启动', icon: 'none' });
        return;
      }
      wx.showToast({ title: '拍照成功', icon: 'none' });
      onResultCallback?.({ type: 'photo', tempImagePath: res.tempImagePath });
    })
    .catch(() => {
      wx.showToast({ title: '拍照失败', icon: 'none' });
    });
}

/** 开始录像 */
export function startRecord() {
  if (!camera) {
    wx.showToast({ title: '请先创建相机', icon: 'none' });
    return;
  }
  camera.startRecord();
  wx.showToast({ title: '录像中...', icon: 'none' });
}

/** 停止录像 */
export function stopRecord() {
  if (!camera) return;
  camera
    .stopRecord()
    .then((res: any) => {
      wx.showToast({ title: '录像成功', icon: 'none' });
      onResultCallback?.({
        type: 'video',
        tempVideoPath: res.tempVideoPath,
        tempThumbPath: res.tempThumbPath,
      });
    })
    .catch((res: any) => {
      if (res?.errMsg === 'operateCamera:fail:is not recording') {
        wx.showToast({ title: '输出失败：没有点击开始录制', icon: 'none' });
      } else if (res?.errMsg === 'operateCamera:fail:stop error') {
        wx.showToast({ title: '输出失败：录制的时间过短', icon: 'none' });
      } else {
        wx.showToast({ title: `输出失败：${res?.errMsg || '未知错误'}`, icon: 'none' });
      }
    });
}

export function onUnload() {
  if (camera) {
    camera.destroy();
    camera = null;
  }
}
