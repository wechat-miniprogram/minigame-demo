/**
 * 创建/删除目录
 * FileSystemManager.mkdir / FileSystemManager.rmdir
 */

const show = require('../../../libs/show');

/** 创建目录 */
export function mkdir(onSuccess?: () => void) {
  wx.getFileSystemManager().mkdir({
    dirPath: `${wx.env.USER_DATA_PATH}/fileA`,
    recursive: true,
    success() {
      onSuccess && onSuccess();
      show.Toast('创建成功', 'success', 800);
    },
  });
}

/** 删除目录 */
export function rmdir(onSuccess?: () => void) {
  wx.getFileSystemManager().rmdir({
    dirPath: `${wx.env.USER_DATA_PATH}/fileA`,
    recursive: true,
    success() {
      onSuccess && onSuccess();
      show.Toast('删除成功', 'success', 800);
    },
  });
}

/** 检查 fileA 目录是否存在 */
export function checkDirExists(): Promise<boolean> {
  return new Promise((resolve) => {
    wx.getFileSystemManager().access({
      path: `${wx.env.USER_DATA_PATH}/fileA`,
      success() {
        resolve(true);
      },
      fail() {
        resolve(false);
      },
    });
  });
}

/** 页面卸载时清理 */
export function onUnload() {}
