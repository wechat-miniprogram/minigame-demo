/**
 * 判断文件路径是否是目录
 * FileSystemManager.stat
 */

const show = require('../../../libs/show');

/** 获取路径 stat 信息并判断是目录还是文件 */
export function statPath(index: number) {
  wx.getFileSystemManager().stat({
    path: [
      `${wx.env.USER_DATA_PATH}`,
      `${wx.env.USER_DATA_PATH}/fileA/hello.txt`,
    ][index],
    success(res: any) {
      const stats = res.stats;
      show.Toast(`是一个${stats.isDirectory() ? '目录' : '文件'}`, 'success', 800);
    },
    fail(res: any) {
      if (!res.errMsg) return;
      if (res.errMsg.includes('no such file or directory')) {
        show.Modal(
          `源文件，或上级目录 ${JSON.stringify(
            `${wx.env.USER_DATA_PATH}/fileA`,
          )} 不存在，请去创建`,
          '发生错误',
        );
      }
    },
  });
}

/** 页面卸载时清理 */
export function onUnload() {}
