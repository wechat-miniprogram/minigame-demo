let onImageCallback: ((tempFilePath: string) => void) | null = null;

export function setOnImage(cb: (tempFilePath: string) => void) {
  onImageCallback = cb;
}

/** 下载服务端实例图片 */
export function downloadFile() {
  wx.downloadFile({
    url: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/game.png',
    success(res: any) {
      wx.showToast({ title: '下载成功', icon: 'success', duration: 1000 });
      onImageCallback?.(res.tempFilePath);
    },
    fail() {
      wx.showToast({ title: '下载失败', icon: 'none', duration: 1000 });
    },
  });
}
