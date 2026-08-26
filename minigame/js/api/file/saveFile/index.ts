/**
 * 保存临时文件到本地
 * FileSystemManager.saveFile
 */

const show = require('../../../libs/show');

/** 保存临时文件到本地（通过 downloadFile 生成临时文件再 saveFile） */
export function saveFile(index: number) {
  wx.showLoading({ title: '生成临时文件中', mask: true });
  wx.downloadFile({
    url:
      'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190813/advideo.MP4',
    success(res: any) {
      wx.hideLoading();
      const pathArr = [`${wx.env.USER_DATA_PATH}/fileA/video.MP4`, ''][index];
      let filePath: { filePath?: string } | undefined;
      // 不传 filePath 属性，就会保存为本地缓存文件
      if (pathArr) {
        filePath = { filePath: pathArr };
      }
      (wx.getFileSystemManager().saveFile as any)({
        tempFilePath: res.tempFilePath,
        ...filePath,
        recursive: true,
        success() {
          show.Toast('保存成功', 'success', 800);
        },
        fail(res: any) {
          if (!res.errMsg) return;
          if (
            res.errMsg.includes(
              'fail exceeded the maximum size of the file storage limit 50M',
            )
          ) {
            return show.Modal('超过文件存储限制的最大大小50M', '发生错误');
          }
          if (res.errMsg.includes('fail no such file or directory')) {
            show.Modal(
              `上级目录 ${JSON.stringify(pathArr)} 不存在，请去创建目录`,
              '发生错误',
            );
          }
        },
      });
    },
    fail() {
      wx.hideLoading();
    },
  });
}

/** 页面卸载时清理 */
export function onUnload() {}
