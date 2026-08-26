/**
 * 解压文件
 * FileSystemManager.unzip
 */

const show = require('../../../libs/show');

/** 解压 test.zip 到 fileA 目录 */
export function unzipFile() {
  wx.getFileSystemManager().unzip({
    zipFilePath: 'js/api/file/unzip/assets/test.zip',
    targetPath: `${wx.env.USER_DATA_PATH}/fileA`,
    success() {
      show.Toast('解压成功', 'success', 800);
    },
  });
}

/** 页面卸载时清理 */
export function onUnload() {}
