let onImageCallback: ((imageSrc: string) => void) | null = null;

export function setOnImage(cb: (imageSrc: string) => void) {
  onImageCallback = cb;
}

/** 从相册选择图片并上传 */
export function chooseImage() {
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success(res: any) {
      const imageSrc = res.tempFilePaths[0];
      wx.showLoading({ title: '上传中...', mask: true });
      wx.uploadFile({
        url: 'https://developers.weixin.qq.com/minigame/dev/api/render/image/wx.createImage.html',
        filePath: imageSrc,
        name: 'data',
        success() {
          wx.hideLoading();
          wx.showToast({ title: '上传成功', icon: 'success', duration: 1000 });
          onImageCallback?.(imageSrc);
        },
        fail() {
          wx.hideLoading();
          wx.showToast({ title: '上传失败', icon: 'none', duration: 1000 });
        },
      });
    },
    fail({ errMsg }: any) {
      console.log('chooseImage fail, err is', errMsg);
    },
  });
}
