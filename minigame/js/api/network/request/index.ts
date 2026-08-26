let onDataCallback: ((dataSize: number, elapsed: number) => void) | null = null;

export function setOnData(cb: (dataSize: number, elapsed: number) => void) {
  onDataCallback = cb;
}

/** 发起一个 HTTP 请求 */
export function sendRequest() {
  const time = Date.now();
  wx.request({
    url: 'https://developers.weixin.qq.com/minigame/dev/api/base/system/system-info/wx.getSystemInfoSync.html',
    success(res: any) {
      wx.showToast({ title: '请求成功', icon: 'success', duration: 1000 });
      wx.reportPerformance && wx.reportPerformance(1001, Date.now() - time);
      const dataStr =
        typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
      onDataCallback?.(dataStr.length, Date.now() - time);
    },
    fail() {
      wx.showToast({ title: '请求失败', icon: 'none', duration: 1000 });
    },
  });
}
