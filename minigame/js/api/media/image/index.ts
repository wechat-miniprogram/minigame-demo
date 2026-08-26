/**
 * 图片选择与预览
 * wx.chooseImage / wx.chooseMedia / wx.chooseMessageFile /
 * wx.previewImage / wx.previewMedia /
 * wx.compressImage / wx.saveImageToPhotosAlbum
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/image/wx.chooseImage.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮预览/保存/编辑图片。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'image';
let lastImagePath = '';

/** 授权相机/相册 */
function authorize(scope: string): Promise<void> {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res: any) {
        if (res.authSetting[scope]) {
          resolve();
        } else {
          wx.authorize({
            scope,
            success() {
              resolve();
            },
            fail(err: any) {
              reject(err);
            },
          });
        }
      },
      fail: reject,
    });
  });
}

/** 选择图片（相机/相册） */
export function chooseImage() {
  authorize('scope.camera')
    .then(() => {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res: any) {
          lastImagePath = res.tempFilePaths?.[0] || '';
          setInfo(`选择成功\n路径: ${lastImagePath.slice(-40)}`);
        },
        fail(err: any) {
          setInfo(`选择失败：${err?.errMsg || '未知错误'}`);
        },
      });
    })
    .catch(() => {
      wx.showToast({ title: '需要授权相机/相册权限', icon: 'none' });
    });
}

/** 选择多媒体（图片/视频） */
export function chooseMedia() {
  authorize('scope.camera')
    .then(() => {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image', 'video'],
        sourceType: ['album', 'camera'],
        success(res: any) {
          const f = res.tempFiles?.[0];
          lastImagePath = f?.tempFilePath || '';
          setInfo(`选择成功\n路径: ${lastImagePath.slice(-40)}`);
        },
        fail(err: any) {
          setInfo(`选择失败：${err?.errMsg || '未知错误'}`);
        },
      });
    })
    .catch(() => {
      wx.showToast({ title: '需要授权相机/相册权限', icon: 'none' });
    });
}

/** 从聊天会话选择文件 */
export function chooseMessageFile() {
  wx.chooseMessageFile({
    count: 1,
    type: 'image',
    success(res: any) {
      const f = res.tempFiles?.[0];
      lastImagePath = f?.path || '';
      setInfo(`选择成功\n路径: ${lastImagePath.slice(-40)}`);
    },
    fail(err: any) {
      setInfo(`选择失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 预览上一张图 */
export function previewImage() {
  if (!lastImagePath) {
    wx.showToast({ title: '请先选择一张图', icon: 'none' });
    return;
  }
  wx.previewImage({
    urls: [lastImagePath],
    current: lastImagePath,
    success() {
      setInfo('预览成功');
    },
    fail(err: any) {
      setInfo(`预览失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 预览图片/视频媒体 */
export function previewMedia() {
  if (!lastImagePath) {
    wx.showToast({ title: '请先选择一张图/视频', icon: 'none' });
    return;
  }
  wx.previewMedia({
    sources: [{ url: lastImagePath, type: 'image' }],
    success() {
      setInfo('预览成功');
    },
    fail(err: any) {
      setInfo(`预览失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 压缩上一张图 */
export function compressImage() {
  if (!lastImagePath) {
    wx.showToast({ title: '请先选择一张图', icon: 'none' });
    return;
  }
  wx.compressImage({
    src: lastImagePath,
    quality: 50,
    success() {
      setInfo('压缩成功');
    },
    fail(err: any) {
      setInfo(`压缩失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 保存到相册 */
export function saveImageToPhotosAlbum() {
  if (!lastImagePath) {
    wx.showToast({ title: '请先选择一张图', icon: 'none' });
    return;
  }
  authorize('scope.writePhotosAlbum')
    .then(() => {
      wx.saveImageToPhotosAlbum({
        filePath: lastImagePath,
        success() {
          setInfo('保存成功');
        },
        fail(err: any) {
          setInfo(`保存失败：${err?.errMsg || '未知错误'}`);
        },
      });
    })
    .catch(() => {
      wx.showToast({ title: '需要授权相册权限', icon: 'none' });
    });
}
