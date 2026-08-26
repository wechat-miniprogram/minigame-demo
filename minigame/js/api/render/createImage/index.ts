/**
 * 创建图片对象
 * wx.createImage
 */

let onCreateCb: ((img: any) => void) | null = null;

export function setOnCreate(cb: (img: any) => void) {
  onCreateCb = cb;
}

/** 创建图片并加载 */
export function createImage() {
  const img = wx.createImage();
  if (!img) return;

  const show = require('../../../libs/show');
  show.Modal('已创建成功，确认后进行加载图片', '创建成功', () => {
    img.src = 'images/weapp.jpg';
    img.onload = () => {
      onCreateCb?.(img);
    };
  });
}

export function onUnload() {}
