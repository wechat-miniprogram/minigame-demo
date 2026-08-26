/**
 * 判断文件/目录是否存在
 * FileSystemManager.access
 */

const show = require('../../../libs/show');

/** 判断文件/目录是否存在 */
export function accessFile(index: number) {
  const path = [
    `${wx.env.USER_DATA_PATH}/fileA`,
    `${wx.env.USER_DATA_PATH}/fileA/test.txt`,
  ][index];
  wx.getFileSystemManager().access({
    path,
    success() {
      wx.showModal({
        content: path + ' 目录存在',
        showCancel: false,
        confirmColor: '#02BB00',
      });
    },
    fail(res: any) {
      if (!res.errMsg) return;
      let err = res.errMsg.split(',');
      err[0] = '文件/目录不存在';
      show.Modal(err.join(','));
    },
  });
}

/** 页面卸载时清理 */
export function onUnload() {}
