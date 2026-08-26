/**
 * 查看目录内容
 * FileSystemManager.readdir
 */

const show = require('../../../libs/show');

/** 读取 fileA 目录下的文件列表 */
export function readdir(onSuccess?: (dirPath: string) => void) {
  const dirPath = `${wx.env.USER_DATA_PATH}/fileA`;
  wx.getFileSystemManager().readdir({
    dirPath,
    success(res: any) {
      if (!(res.files || []).length) return show.Modal('目录内容为空');
      show.Toast('查看成功', 'success', 800);
      onSuccess && onSuccess(dirPath);
    },
    fail(res: any) {
      if (!res.errMsg) return;
      if (
        res.errMsg.includes('no such file or directory') ||
        res.errMsg.includes('fail not a directory')
      ) {
        res.errMsg = `目录 ${JSON.stringify(dirPath)} 不存在，请去创建`;
        show.Modal(res.errMsg, '发生错误');
      }
    },
  });
}

/** 递归获取目录的文件信息 */
export function statRecursive(path: string, onSuccess?: (stats: any[]) => void) {
  wx.getFileSystemManager().stat({
    path,
    recursive: true,
    success(res: any) {
      onSuccess && onSuccess(res.stats);
    },
  });
}

/** 页面卸载时清理 */
export function onUnload() {}
