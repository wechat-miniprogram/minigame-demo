/**
 * 本地缓存文件
 * FileSystemManager.getSavedFileList / removeSavedFile
 */

const show = require('../../../libs/show');

/** 获取本地缓存文件列表 */
export function getSavedFileList(onSuccess?: (fileList: any[]) => void) {
  wx.getFileSystemManager().getSavedFileList({
    success(res: any) {
      if (!(res.fileList || []).length) return show.Modal('本地缓存文件列表为空');
      show.Toast('获取成功', 'success', 800);
      onSuccess && onSuccess(res.fileList);
    },
  });
}

/** 清空所有本地缓存文件 */
export function removeSavedFile(fileList: any[], onSuccess?: () => void) {
  const promiseArr = fileList.map(
    (item) =>
      new Promise<void>((resolve) => {
        wx.getFileSystemManager().removeSavedFile({
          filePath: item.filePath,
          success() {
            resolve();
          },
        });
      }),
  );
  Promise.all(promiseArr).then(() => {
    show.Toast('已清空', 'success', 800);
    onSuccess && onSuccess();
  });
}

/** 页面卸载时清理 */
export function onUnload() {}
