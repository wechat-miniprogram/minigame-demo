/**
 * 获取文件信息
 * FileSystemManager.getFileInfo
 */

const show = require('../../../libs/show');

/** 获取文件信息 */
export function getFileInfo() {
  wx.getFileSystemManager().getFileInfo({
    filePath: 'images/weapp.jpg',
    success(res: any) {
      show.Modal(`这个文件的size：${res.size}B`, '获取成功');
    },
    fail(res: any) {
      if (!res.errMsg) return;
      show.Modal(res.errMsg, '发生错误');
    },
  });
}

/** 页面卸载时清理 */
export function onUnload() {}
