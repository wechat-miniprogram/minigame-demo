/**
 * 重命名
 * FileSystemManager.rename
 */

const show = require('../../../libs/show');

/** 重命名文件/目录 */
export function renameFile(
  oldPath: string,
  newPath: string,
  onSuccess?: () => void,
) {
  wx.getFileSystemManager().rename({
    oldPath,
    newPath,
    success() {
      show.Toast('重命名成功', 'success', 800);
      onSuccess && onSuccess();
    },
    fail(res: any) {
      if (!res.errMsg) return;
      if (res.errMsg.includes('fail no such file or directory')) {
        res.errMsg = `源文件，或目录 ${JSON.stringify(
          `${wx.env.USER_DATA_PATH}/fileA`,
        )} 不存在，请去创建`;
        show.Modal(res.errMsg, '发生错误');
      }
    },
  });
}

/** 清理 newTestFile 目录 */
export function cleanup() {
  wx.getFileSystemManager().rmdir({
    dirPath: `${wx.env.USER_DATA_PATH}/newTestFile`,
    recursive: true,
  });
}

/** 页面卸载时清理 */
export function onUnload() {
  cleanup();
}
